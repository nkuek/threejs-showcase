import { Link } from "react-router";
import sitemap from "~/utils/sitemap";

export default function Home() {
  return (
    <div className="h-svh grid place-items-center w-full">
      <ul className="flex flex-col gap-8">
        {Object.entries(sitemap)
          .filter(([key]) => key !== "home")
          .map(([, link]) => (
            <li key={link.path}>
              <Link
                className="text-4xl hover:underline hover:cursor-pointer"
                to={link.path}
              >
                {link.label}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
