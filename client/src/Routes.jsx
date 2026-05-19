import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import PostDetails from "./PostDetails"
import Profile from "./ProfileDetails"
import Settings from "./Settings"

const hasSubfolder = window.location.pathname.startsWith("/messaging-app");
const basename = hasSubfolder ? "/messaging-app" : "/";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/profile/:handle",
    element: <Profile />,
  },
  {
    path: "/:userId/:postId",
    element: <PostDetails />,
  },
  {
    path: "/Settings",
    element: <Settings />,
  },
], { basename });

export default router;
