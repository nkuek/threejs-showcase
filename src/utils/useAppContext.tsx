import { createContext, useContext } from "react";
import { Theme } from "./sitemap";

type AppContextState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  transitionDirection: "forward" | "backward";
  setTransitionDirection: (direction: "forward" | "backward") => void;
};

export const AppContext = createContext<AppContextState | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error(
      "useRouterContext must be used within a RouterContextProvider"
    );
  }
  return context;
}
