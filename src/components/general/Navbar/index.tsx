import { useAppContext } from "~/utils/useAppContext";
import Logo from "~/assets/logo.svg?react";
import { Link } from "react-router";
import { externalLinks } from "~/utils/sitemap";

export default function Navbar() {
  const { theme } = useAppContext();
  return (
    <nav
      className="data-[theme=light]:text-stone-800 flex gap-4 justify-between items-center py-4 px-6 absolute top-0 left-0 right-0 text-stone-100 z-30 transition-colors"
      data-theme={theme}
    >
      <Link to={externalLinks.portfolio.path} className="hover:cursor-pointer">
        <span className="sr-only">See my full portfolio</span>
        <Logo className="w-11" />
      </Link>
    </nav>
  );
}
