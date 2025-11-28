import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import LoginPage from "./pages/Loginpage.jsx";
import Register from "./pages/Register.jsx";
import NewPost from "./pages/NewPost.jsx";
import EditPost from "./pages/EditPost.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import Profile from "./pages/Profile.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="post/new" element={<NewPost />} />
          <Route path="post/:id" element={<PostDetail />} />
          <Route path="post/edit/:id" element={<EditPost />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
