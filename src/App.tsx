import RouterContextProvider from "~/components/general/RouterProvider";
import Router from "~/components/general/Router";
import { Suspense } from "react";
import Navigation from "./components/general/Navigation";

function App() {
  return (
    <RouterContextProvider>
      <Navigation />
      <Suspense fallback={"Loading..."}>
        <Router />
      </Suspense>
    </RouterContextProvider>
  );
}

export default App;
