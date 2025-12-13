import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Create from "./pages/create/Create";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import LeftBar from "./components/leftbar/LeftBar";
import RightBar from "./components/rightbar/RightBar";
import NavBar from "./components/navbar/NavBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import PostDetails from "./pages/post/PostDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import "./style.scss";
import { DarkModeContext } from "./context/darkModeContext";
import { useContext} from 'react';


function App() {

  const {darkMode} = useContext(DarkModeContext)

  const Layout = ()=>{
    return (<div className={`theme-${darkMode ? "dark" : "light"}`}>
      <NavBar />
      <div style={{ display: "flex" }}>
        <LeftBar />
        <div style={{flex: 6}}>
          <Outlet />
        </div>
        <RightBar />  
      </div>
    </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        }
        ,
        {
          path: "/post/:id",
          element: <PostDetails />
        }
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/create",
      element: <ProtectedRoute element={<Create />} />
    }
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;