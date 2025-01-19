import { useEffect } from "react";
import Link from "~/components/general/Link";
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
          <Link
            key={link.path}
            className="text-4xl hover:underline hover:cursor-pointer"
            to={link.path}
          >
            {link.label}
          </Link>
        ))}
    </div>
  );
}
