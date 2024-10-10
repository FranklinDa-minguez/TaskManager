import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={LandingPage} />
        <Route path="login" Component={LoginPage}/>
        <Route path="*" Component={NotFound}/>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;