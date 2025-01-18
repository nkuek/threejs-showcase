import { useEffect, useState, useTransition } from "react";
import { RouterContext } from "~/utils/useRouterContext";

export default function RouterContextProvider(props: {
  children: React.ReactNode;
}) {
  const [page, setPage] = useState(window.location.pathname);
  const [isTransitioning, startTransition] = useTransition();
  const [theme, setTheme] = useState("light");

  function navigate(href: string) {
    startTransition(() => {
      if (href === window.location.pathname) return;
      window.history.pushState({}, "", href);
      setPage(href);
    });
  }

  useEffect(() => {
    function handlePopState() {
      startTransition(() => {
        setPage(window.location.pathname);
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  return (
    <RouterContext.Provider
      value={{
        page,
        isTransitioning,
        navigate,
        theme,
        setTheme,
      }}
    >
      {props.children}
    </RouterContext.Provider>
  );
}
