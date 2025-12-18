import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createRoot } from "react-dom/client";
import { Route, HashRouter as Router, Routes } from "react-router";
import { App } from "./App";
import { CreateFriendView } from "./views/CreateFriendView";
import { EditFriendView } from "./views/EditFriendView";
import { FriendsView } from "./views/FriendsView";

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<FriendsView />} />
        <Route path="create" element={<CreateFriendView />} />
        <Route path="edit/:id" element={<EditFriendView />} />
      </Route>
    </Routes>
  </Router>,
);

/* Router configured with HashRouter/Routes from react-router */
