import { createBrowserRouter } from "react-router-dom";
import App from "./App";
// import Login from "./LoginPage"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    // {
    //     path: "/login/",
    //     element: < Login />
    // }
]);

export default router;
