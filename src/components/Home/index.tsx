import sitemap from "~/utils/sitemap";

export default function Home(props: { navigate: (href: string) => void }) {
  return (
    <div className="h-screen grid place-items-center">
      {Object.entries(sitemap)
        .filter(([key]) => key !== "home")
        .map(([, link]) => (
          <button
            key={link.href}
            className="text-4xl font-bold hover:underline"
            onClick={() => {
              props.navigate(link.href);
            }}
          >
            {link.label}
          </button>
        ))}
    </div>
  );
}
