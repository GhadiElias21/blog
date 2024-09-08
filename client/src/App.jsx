/* eslint-disable react/no-unknown-property */
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import FooterComp from "./components/FooterComp";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminRoute from "./components/OnlyAdminRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
        
          <Route path="/update-post/:postId" element={<UpdatePost />} />
      
      
      
          </Route>

          <Route path='/projects' element={<Projects/>}/>
          <Route path='/post/:postSlug' element={<PostPage/>}/>

      </Routes>

      <Toaster />
      <FooterComp />
    </>
  );
}

export default App;
