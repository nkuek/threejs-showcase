import AppContextProvider from "~/components/general/AppProvider";
import { HashRouter } from "react-router";
import Router from "~/components/general/Router";

function App() {
  return (
    <div className="bg-stone-100">
      <AppContextProvider>
        <HashRouter>
          <Router />
        </HashRouter>
      </AppContextProvider>
    </div>
  );
}

export default App;
