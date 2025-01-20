import { Link } from "react-router";
import sitemap from "~/utils/sitemap";

export default function Home() {
  return (
    <div className="h-screen grid place-items-center bg-white w-full">
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
