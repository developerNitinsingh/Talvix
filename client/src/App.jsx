import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useDispatch } from "react-redux";
import api from "./configs/api";
import { login, setLoading } from "./app/features/authSlice";
import { Toaster } from "react-hot-toast";
import ResumeTailor from "./pages/ResumeTailor";
import News from "./pages/talvix_ai_workforce_resume_platform";
import { CustomStyles } from "./components/CustomStyles";

const App = () => {
  const dispatch = useDispatch();

  const getUserData = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        const { data } = await api.get("/api/users/data", {
          headers: { Authorization: token },
        });

        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }

        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="">
      <CustomStyles />
      <Toaster />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] radial-aurora opacity-70"></div>
        <div className="absolute -top-32 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-[40%] -left-32 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-60"></div>
      </div>

      {/* <News /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="app" element={<Layout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
          <Route path="tailor-resume" element={<ResumeTailor />} />
        </Route>

        <Route path="view/:resumeId" element={<Preview />} />
      </Routes>
    </div>
  );
};

export default App;
