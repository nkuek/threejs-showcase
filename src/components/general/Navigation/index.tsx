import sitemap from "~/utils/sitemap";
import { useRouterContext } from "~/utils/useRouterContext";

export default function Navigation() {
  const { page } = useRouterContext();
  return (
    <nav className="flex gap-4 p-8">
      {Object.values(sitemap).map((route) => (
        <a
          href={route.href}
          key={route.label}
          className="hover:underline data-[selected=true]:underline"
          data-selected={page === route.href}
        >
          {route.label}
        </a>
      ))}
    </nav>
  );
}
