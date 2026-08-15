import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { dummyResumeData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeID, setEditResumeID] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get(
        "/api/users/resumes",

        { headers: { Authorization: token } },
      );
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const createResume = async (e) => {
    try {
      e.preventDefault();
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        { headers: { Authorization: token } },
      );

      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText },
        { headers: { Authorization: token } },
      );
      // console.log("data: ", data);

      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setIsLoading(false);
  };

  const editTitle = async (e) => {
    try {
      e.preventDefault();
      const { data } = await api.put(
        "/api/resumes/update",
        { resumeId: editResumeID, resumeData: { title } },
        { headers: { Authorization: token } },
      );
      setAllResumes(
        allResumes.map((resume) =>
          resume._id === editResumeID ? { ...resume, title } : resume,
        ),
      );
      setTitle("");
      setEditResumeID("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this resume?",
      );
      if (confirm) {
        const { data } = await api.delete(
          `/api/resumes/delete/${resumeId}`,

          { headers: { Authorization: token } },
        );
        setAllResumes(allResumes.filter((resume) => resume._id !== resumeId));
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent sm:hidden">
          Welcome, {user?.name}
        </p>

        <div className="flex gap-4 ">
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full bg-slate-800/50 backdrop-blur sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-emerald-400 border border-dashed border-emerald-500/30 group hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer "
          >
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full" />
            <p className="text-sm group-hover:text-emerald-300 transition-all duration-300 ">
              Create Resume
            </p>
          </button>
          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full bg-slate-800/50 backdrop-blur sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-emerald-400 border border-dashed border-emerald-500/30 group hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer "
          >
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full" />
            <p className="text-sm group-hover:text-emerald-300 transition-all duration-300 ">
              Upload Existing
            </p>
          </button>
        </div>

        <hr className="border-emerald-500/20 my-6 sm:w-[305px]" />

        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            return (
              <button
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                key={index}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}15, ${baseColor}30)`,
                  borderColor: baseColor + "50",
                }}
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />
                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>
                <p
                  className="absolute bottom-1 text-[11px] text-gray-400 group-hover:text-gray-300 transition-all duration-300 px-2 text-center"
                  style={{ color: baseColor + "90" }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 group-hover:flex items-center hidden"
                >
                  <TrashIcon
                    onClick={() => deleteResume(resume._id)}
                    className=" size-7 p-1.5 hover:bg-slate-700/50 rounded text-gray-400 hover:text-red-400 transition-colors"
                  />
                  <PencilIcon
                    onClick={() => {
                      setEditResumeID(resume._id);
                      setTitle(resume.title);
                    }}
                    className="size-7 p-1.5 hover:bg-slate-700/50 rounded text-gray-400 hover:text-emerald-400 transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            action=""
            className="fixed inset-0 bg-black/70 backdrop-blur  bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              className="relative bg-slate-800 border border-emerald-500/30 shadow-md rounded-lg w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 text-gray-100">
                Create a Resume
              </h2>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                className="w-full px-4 py-2 mb-4 bg-slate-700/50 text-gray-100 placeholder-gray-500 border border-emerald-500/30 focus:border-emerald-400 focus:ring-emerald-400 rounded"
                placeholder="Enter resume title"
                required
              />

              <button className="w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors duration-200">
                Create Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            action=""
            className="fixed inset-0 bg-black/70 backdrop-blur  bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              className="relative bg-slate-800 border border-emerald-500/30 shadow-md rounded-lg w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 text-gray-100">
                Upload Resume
              </h2>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                className="w-full px-4 py-2 mb-4 bg-slate-700/50 text-gray-100 placeholder-gray-500 border border-emerald-500/30 focus:border-emerald-400 focus:ring-emerald-400 rounded"
                placeholder="Enter resume title"
                required
              />

              <div className="">
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-gray-300"
                >
                  Select resume file
                  <div
                    className="flex flex-col items-center justify-center gap-2 border group text-gray-400 border-emerald-500/30 border-dashed
                 rounded-md p-4 py-10 my-4 hover:border-emerald-400 hover:text-emerald-400 cursor-pointer transition-colors"
                  >
                    {resume ? (
                      <p className="text-emerald-400">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-14 stroke-1" />
                        <p className="">Upload resume</p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  name=""
                  id="resume-input"
                  className=""
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>

              <button
                disabled={isLoading}
                className="w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors flex items-center gap-2 justify-center disabled:opacity-50"
              >
                {isLoading && (
                  <LoaderCircleIcon className="animate-spin size-4 text-white" />
                )}
                {isLoading ? "Uploading..." : "Upload Resume"}
              </button>

              <XIcon
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {editResumeID && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeID("")}
            action=""
            className="fixed inset-0 bg-black/70 backdrop-blur  bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              className="relative bg-slate-800 border border-emerald-500/30 shadow-md rounded-lg w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 text-gray-100">
                Edit Resume Title
              </h2>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                className="w-full px-4 py-2 mb-4 bg-slate-700/50 text-gray-100 placeholder-gray-500 border border-emerald-500/30 focus:border-emerald-400 focus:ring-emerald-400 rounded"
                placeholder="Enter resume title"
                required
              />

              <button className="w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition-colors duration-200">
                Update
              </button>

              <XIcon
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeID("");
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
