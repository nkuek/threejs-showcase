import { useEffect } from "react";
import InternalLink from "~/components/general/InternalLink";
import sitemap from "~/utils/sitemap";
import { useRouterContext } from "~/utils/useRouterContext";

export default function Home() {
  const { setTheme } = useRouterContext();
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);
  return (
    <div className="h-screen grid place-items-center">
      {Object.entries(sitemap)
        .filter(([key]) => key !== "home")
        .map(([, link]) => (
          <InternalLink
            key={link.href}
            className="text-4xl hover:underline hover:cursor-pointer"
            href={link.href}
          >
            {link.label}
          </InternalLink>
        ))}
    </div>
  );
}
