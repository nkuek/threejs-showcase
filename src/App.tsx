import RouterContextProvider from "./components/RouterProvider";
import Router from "./components/Router";
import { Suspense } from "react";

function App() {
  return (
    <RouterContextProvider>
      <Suspense fallback={"Loading..."}>
        <Router />
      </Suspense>
    </RouterContextProvider>
  );
}

export default App;
