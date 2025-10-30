import { useState } from "react";
import "./App.css";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import ProfilePage from "../pages/ProfilePage";
import LoginPage from "../pages/LoginPage";
import RoutesProtector from "../components/RoutesProtector";
import Navbar from "../components/Navbar";
import HomePage from "../pages/HomePage";
import TopicsPage from "../pages/TopicsPage";
import LessonsPage from "../pages/LessonsPage";
import QuizPage from "../pages/QuizPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/topics" element={<TopicsPage />} />
        <Route
          path="/lessons/:topic"
          element={
            <RoutesProtector>
              <LessonsPage />
            </RoutesProtector>
          }
        />
        <Route path="/quiz/:topicId" element={<QuizPage />} />

        <Route
          path="/profile"
          element={
            <RoutesProtector>
              <ProfilePage />
            </RoutesProtector>
          }
        />
      </Routes>
    </>
  );
}

export default App;
