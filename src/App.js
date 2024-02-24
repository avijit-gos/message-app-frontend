/** @format */
import "./App.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./Authentication/Authentication";
import Register from "./Pages/Public/Register/Register";
import Login from "./Pages/Public/Login/Login";
import Home from "./Pages/Private/Home/Home";
import ChatMainPage from "./Pages/Private/ChatMainPage/ChatMainPage";

function App() {
  return (
    <Routes>
      <Route path='/register' exact element={<Register />} />
      <Route path='/login' exact element={<Login />} />

      <Route
        path='/'
        exact
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path='/chat/:id'
        exact
        element={
          <ProtectedRoute>
            <ChatMainPage />
          </ProtectedRoute>
        }
      />

      <Route path='*' exact element={<>Page not found 404!!!</>} />
    </Routes>
  );
}

export default App;
