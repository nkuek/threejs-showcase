import AppContextProvider from "~/components/general/AppProvider";
import { BrowserRouter } from "react-router";
import Router from "~/components/general/Router";
import { Analytics } from "@vercel/analytics/next";

function App() {
  return (
    <div className="bg-stone-100">
      <Analytics />
      <AppContextProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AppContextProvider>
    </div>
  );
}

export default App;
