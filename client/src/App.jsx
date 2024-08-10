import { Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
function App() {
  return (
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About/>} />
        <Route path="/projects" element={<Projects/>} />
        <Route path="sign-in" element={<Signin/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/dashboard" element={<Dashboard/>} />

      </Routes>

  );
}

export default App;
