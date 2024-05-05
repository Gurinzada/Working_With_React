import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import UserPage from "./Pages/UserPage";
import LoginPage from "./Pages/LoginPage";


const Router = createBrowserRouter([
    {
        element: <RegisterPage/>,
        path:"/"
    },{
        element:<UserPage/>,
        path:"/user/:UserID"
    },{
        element:<LoginPage/>,
        path:"/login"
    }
])



export default Router