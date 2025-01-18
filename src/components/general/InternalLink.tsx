import { HTMLAttributes } from "react";
import { useRouterContext } from "~/utils/useRouterContext";

export default function InternalLink({
  children,
  href,
  ...props
}: {
  children: React.ReactNode;
  href: string;
} & HTMLAttributes<HTMLAnchorElement>) {
  const { navigate } = useRouterContext();
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
