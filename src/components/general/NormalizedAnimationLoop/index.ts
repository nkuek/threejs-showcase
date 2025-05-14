interface NormalizedAnimationLoopOptions {
  /** Time multiplier (default: 1.0) */
  timeScale?: number;
  /** Maximum delta time in seconds to prevent spiral of death (default: 0.1) */
  maxDeltaTime?: number;
  /** Update callback function */
  update?: (deltaTime: number) => void;
}

/**
 * Normalized Animation Loop for consistent animations
 * regardless of frame rate or device performance
 */
class NormalizedAnimationLoop {
  private timeScale: number;
  private maxDeltaTime: number;
  private isRunning: boolean;
  private requestId: number | null;
  private lastTime: number | null;
  private updateCallback: ((deltaTime: number) => void) | null;

  constructor(options: NormalizedAnimationLoopOptions = {}) {
    // Configuration
    this.timeScale = options.timeScale || 1.0;
    this.maxDeltaTime = options.maxDeltaTime || 0.1;

    // State
    this.isRunning = false;
    this.requestId = null;
    this.lastTime = null;

    // Callback functions
    this.updateCallback = options.update || null;

    // Bind methods to this instance
    this.tick = this.tick.bind(this);
  }

  /**
   * Start the animation loop
   */
  public start(): this {
    if (this.isRunning) return this;

    this.isRunning = true;
    this.lastTime = performance.now();
    this.requestId = requestAnimationFrame(this.tick);

    return this;
  }

  /**
   * Stop the animation loop
   */
  public stop(): this {
    if (!this.isRunning) return this;

    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId);
    }

    this.isRunning = false;
    this.requestId = null;

    return this;
  }

  /**
   * Set the update callback
   */
  public onUpdate(callback: (deltaTime: number) => void): this {
    this.updateCallback = callback;
    return this;
  }

  /**
   * Set the time scale
   */
  public setTimeScale(scale: number): this {
    this.timeScale = scale;
    return this;
  }

  /**
   * The main animation loop function
   */
  private tick(currentTime: number): void {
    // Request next frame first to optimize event loop
    this.requestId = requestAnimationFrame(this.tick);

    // Calculate time since last frame
    if (this.lastTime === null) {
      this.lastTime = currentTime;
      return;
    }

    let deltaTime = (currentTime - this.lastTime) / 1000; // convert to seconds

    // Apply time scale
    deltaTime *= this.timeScale;

    // Cap maximum delta time to avoid spiral of death
    if (deltaTime > this.maxDeltaTime) {
      deltaTime = this.maxDeltaTime;
    }

    // Update last time
    this.lastTime = currentTime;

    // Call the update function with the normalized delta time
    if (this.updateCallback) {
      this.updateCallback(deltaTime);
    }
  }
}
export default NormalizedAnimationLoop;
