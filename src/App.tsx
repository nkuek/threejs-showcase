import AppContextProvider from "~/components/general/AppProvider";
import { BrowserRouter } from "react-router";
import Router from "~/components/general/Router";

function App() {
  return (
    <div className="bg-stone-100">
      <AppContextProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AppContextProvider>
    </div>
  );
}

export default App;
