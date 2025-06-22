import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import PostDetails from "./PostDetails"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },  
//   {
//     path: "/:userId", 
//     element: <UserProfile />,
//   },
  {
    path: "/:userId/:postId",
    element: <PostDetails />,
  },
]);

export default router;
