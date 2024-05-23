import Navigation from "./Components/Navigation/Navigation";
import Signup from "./Components/Authentication/Signup";
import Login from "./Components/Authentication/Login";
import Home from "./Components/Pages/Home";
import EditProfile from "./Components/Pages/EditProfile";
import Users from "./Components/Pages/Users";
import ProtectedRoute from "./Components/Pages/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" exact element={<ProtectedRoute />}>
          <Route path="/" exact element={<Home />} />
        </Route>

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route path="/editprofile" element={<ProtectedRoute />}>
          <Route path="/editprofile" element={<EditProfile />} />
        </Route>
        <Route path="/profiles" element={<ProtectedRoute />}>
          <Route path="/profiles" element={<Users />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
