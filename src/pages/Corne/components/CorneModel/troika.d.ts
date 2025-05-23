declare module "troika-three-text" {
  export function getCaretAtPoint(
    textRenderInfo,
    x,
    y,
  ): {
    charIndex: number;
    height: number;
    x: number;
    y: number;
  } {
    let closestCaret = null;
    const rows = groupCaretsByRow(textRenderInfo);

    // Find nearest row by y first
    let closestRow = null;
    rows.forEach((row) => {
      if (
        !closestRow ||
        Math.abs(y - (row.top + row.bottom) / 2) <
          Math.abs(y - (closestRow.top + closestRow.bottom) / 2)
      ) {
        closestRow = row;
      }
    });

    // Then find closest caret by x within that row
    closestRow.carets.forEach((caret) => {
      if (
        !closestCaret ||
        Math.abs(x - caret.x) < Math.abs(x - closestCaret.x)
      ) {
        closestCaret = caret;
      }
    });
    return closestCaret;
  }

  export function getSelectionRects(textRenderInfo, start, end) {
    let rects;
    if (textRenderInfo) {
      // Check cache - textRenderInfo is frozen so it's safe to cache based on it
      const prevResult = _rectsCache.get(textRenderInfo);
      if (prevResult && prevResult.start === start && prevResult.end === end) {
        return prevResult.rects;
      }

      const { caretPositions } = textRenderInfo;

      // Normalize
      if (end < start) {
        const s = start;
        start = end;
        end = s;
      }
      start = Math.max(start, 0);
      end = Math.min(end, caretPositions.length + 1);

      // Build list of rects, expanding the current rect for all characters in a run and starting
      // a new rect whenever reaching a new line or a new bidi direction
      rects = [];
      let currentRect = null;
      for (let i = start; i < end; i++) {
        const x1 = caretPositions[i * 4];
        const x2 = caretPositions[i * 4 + 1];
        const left = Math.min(x1, x2);
        const right = Math.max(x1, x2);
        const bottom = caretPositions[i * 4 + 2];
        const top = caretPositions[i * 4 + 3];
        if (
          !currentRect ||
          bottom !== currentRect.bottom ||
          top !== currentRect.top ||
          left > currentRect.right ||
          right < currentRect.left
        ) {
          currentRect = {
            left: Infinity,
            right: -Infinity,
            bottom,
            top,
          };
          rects.push(currentRect);
        }
        currentRect.left = Math.min(left, currentRect.left);
        currentRect.right = Math.max(right, currentRect.right);
      }

      // Merge any overlapping rects, e.g. those formed by adjacent bidi runs
      rects.sort((a, b) => b.bottom - a.bottom || a.left - b.left);
      for (let i = rects.length - 1; i-- > 0; ) {
        const rectA = rects[i];
        const rectB = rects[i + 1];
        if (
          rectA.bottom === rectB.bottom &&
          rectA.top === rectB.top &&
          rectA.left <= rectB.right &&
          rectA.right >= rectB.left
        ) {
          rectB.left = Math.min(rectB.left, rectA.left);
          rectB.right = Math.max(rectB.right, rectA.right);
          rects.splice(i, 1);
        }
      }

      _rectsCache.set(textRenderInfo, { start, end, rects });
    }
    return rects;
  }
}
