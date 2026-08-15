import React from "react";
import { LockIcon, MailIcon, User2Icon } from "lucide-react";
import api from "../configs/api";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");
  const [state, setState] = React.useState(urlState || "login");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/api/users/${state}`, formData);
      dispatch(login(data));
      localStorage.setItem("token", data.token);
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-emerald-500/30 rounded-2xl px-8 bg-slate-900/50 backdrop-blur-sm"
      >
        <h1 className="text-gray-100 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign up"}
        </h1>
        <p className="text-gray-400 text-sm mt-2">Please {state} to continue</p>
        {state !== "login" && (
          <div className="flex items-center mt-6 w-full bg-slate-800/50 border border-emerald-500/20 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2Icon size={16} color="#10b981" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border-none outline-none ring-0 bg-transparent text-gray-100 placeholder-gray-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="flex items-center w-full mt-4 bg-slate-800/50 border border-emerald-500/20 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <MailIcon size={13} color="#10b981" />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="border-none outline-none ring-0 bg-transparent text-gray-100 placeholder-gray-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center mt-4 w-full bg-slate-800/50 border border-emerald-500/20 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <LockIcon size={13} color="#10b981" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none outline-none ring-0 bg-transparent text-gray-100 placeholder-gray-500"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mt-4 text-left text-emerald-400">
          <button
            className="text-sm hover:text-emerald-300 transition-colors"
            type="reset"
          >
            Forget password?
          </button>
        </div>
        <button
          type="submit"
          className="mt-2 w-full h-11 rounded-full text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>
        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <a
            href="#"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            click here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
