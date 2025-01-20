import { useState } from "react";
import { Theme } from "~/utils/sitemap";
import { AppContext } from "~/utils/useAppContext";

export default function AppContextProvider(props: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("light");
  const [transitionDirection, setTransitionDirection] = useState<
    "forward" | "backward"
  >("forward");

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        transitionDirection,
        setTransitionDirection,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
