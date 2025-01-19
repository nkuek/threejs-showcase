import { LinkProps, Link as RouterLink } from "react-router";
import { useRouterContext } from "~/utils/useRouterContext";

export default function Link(props: LinkProps) {
  const { navigate } = useRouterContext();
  return (
    <RouterLink
      {...props}
      onClick={() => {
        navigate(props.to.toString());
      }}
    />
  );
}
