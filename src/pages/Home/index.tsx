import { useEffect } from "react";
import sitemap from "~/utils/sitemap";
import { useRouterContext } from "~/utils/useRouterContext";

export default function Home(props: { navigate: (href: string) => void }) {
  const { setTheme } = useRouterContext();
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);
  return (
    <div className="h-screen grid place-items-center">
      {Object.entries(sitemap)
        .filter(([key]) => key !== "home")
        .map(([, link]) => (
          <a
            key={link.href}
            className="text-4xl hover:underline hover:cursor-pointer"
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              props.navigate(link.href);
            }}
          >
            {link.label}
          </a>
        ))}
    </div>
  );
}
