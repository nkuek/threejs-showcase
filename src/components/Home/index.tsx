import sitemap from "~/utils/sitemap";

export default function Home() {
  return (
    <div className="h-screen grid place-items-center">
      {Object.entries(sitemap)
        .filter(([key]) => key !== "home")
        .map(([_, link]) => (
          <a
            key={link.href}
            className="text-4xl font-bold hover:underline"
            href={link.href}
          >
            {link.label}
          </a>
        ))}
    </div>
  );
}
