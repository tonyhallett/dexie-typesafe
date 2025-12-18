import { createRoot } from "react-dom/client";
// import { Route, HashRouter as Router, Routes } from "react-router";
import { App } from "./App";

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<App />);

/* <Router>
    <Routes>
      <Route path="/" element={<App />}></Route>
    </Routes>
  </Router> */
