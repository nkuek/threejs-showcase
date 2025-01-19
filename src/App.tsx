import RouterContextProvider from "~/components/general/RouterProvider";
import { HashRouter } from "react-router";
import Router from "~/components/general/Router";

function App() {
  return (
    <RouterContextProvider>
      <HashRouter>
        <Router />
      </HashRouter>
    </RouterContextProvider>
  );
}

export default App;
