import { useEffect, useState, useTransition } from "react";
import { RouterContext } from "~/utils/useRouterContext";

export default function RouterContextProvider(props: {
  children: React.ReactNode;
}) {
  const [page, setPage] = useState(window.location.pathname);
  const [isTransitioning, startTransition] = useTransition();

  function navigate(href: string) {
    startTransition(() => {
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
      }}
    >
      {props.children}
    </RouterContext.Provider>
  );
}
