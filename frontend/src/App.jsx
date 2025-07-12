import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={authUser ? <HomePage />:<Navigate to="login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/"/>} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/"/>} />
      </Routes>
    </div>
  )
}

export default App
