import {
  ArrowRight,
  FileText,
  LoaderCircle,
  Sparkles,
  Target,
  Upload,
} from "lucide-react"; 
import React, { useRef, useState } from "react";
import pdfToText from "react-pdftotext";
import api from "../configs/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ResumeTailor = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContainerClick = () => {
    setError("");
    inputRef.current?.click();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleContainerClick();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name.toLowerCase();

    if (
      name.endsWith(".pdf") ||
      name.endsWith(".doc") ||
      name.endsWith(".docx")
    ) {
      setFileName(file.name);
      setSelectedFile(file);
      setError("");
      return;
    }

    if (name.endsWith(".json")) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        try {
          JSON.parse(text);
        } catch {
          setError("Invalid JSON file");
        }
      };
      reader.readAsText(file);
      return;
    }

    setError("Unsupported file type. Please upload a PDF or Word document.");
    setFileName("");
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please upload your resume before continuing.");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please paste a target job description.");
      return;
    }

    setIsSubmitting(true);

    try {
      const resumeText = await pdfToText(selectedFile);

      const { data } = await api.post(
        "/api/ai/extract-update-resume",
        { resumeText, jobDescription },
        { headers: { Authorization: token } },
      );

      navigate(`/app/builder/${data.resumeId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = selectedFile && jobDescription.trim().length > 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAFCFB] text-slate-800 pb-16">
      {/* Page header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-[#FAFCFB] pt-10 pb-8 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-200/60">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-gradient-to-r from-emerald-200/30 via-teal-100/40 to-emerald-100/20 blur-3xl pointer-events-none rounded-full -z-10" />

        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#00D26A]" />
            AI-Powered Resume Tailoring
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Tailor your resume to any
            <span className="bg-gradient-to-r from-emerald-600 via-[#00D26A] to-teal-500 bg-clip-text text-transparent">
              job description
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload your current resume and paste the target role&apos;s job
            post. Our AI will align your experience, keywords, and skills for a
            stronger ATS match.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8"
      >
        {/* Two-column input grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resume upload card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00D26A]" />
                <h2 className="text-lg font-bold text-slate-900">
                  1. Your Current Resume
                </h2>
              </div>
              <span className="text-xs font-medium text-slate-400">
                PDF or Word
              </span>
            </div>
         
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer mb-2 group transition-all ${
                fileName
                  ? "border-[#00D26A] bg-emerald-50/50"
                  : "border-emerald-200 hover:border-[#00D26A] bg-emerald-50/30 hover:bg-emerald-50/70"
              }`}
              onClick={handleContainerClick}
              role="button"
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 bg-white rounded-full shadow-xs flex items-center justify-center mx-auto mb-3 text-[#00D26A] group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                {fileName ? "Replace resume file" : "Click to upload your resume"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports PDF or Word documents (.pdf, .doc, .docx)
              </p>
              {fileName && (
                <p className="inline-flex items-center gap-1.5 text-sm text-emerald-700 mt-3 font-medium bg-emerald-100/80 px-3 py-1 rounded-full">
                  <FileText className="w-3.5 h-3.5" />
                  {fileName}
                </p>
              )}
              {error && (
                <p className="text-sm text-red-600 mt-3 font-medium">{error}</p>
              )}
            </div>
          </div>

          {/* Job description card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#00D26A]" />
                <h2 className="text-lg font-bold text-slate-900">
                  2. Target Job Description
                </h2>
              </div>
              <span className="text-xs font-medium text-[#00D26A] bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                Target Role Alignment
              </span>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="job-description"
                  className="text-xs font-semibold text-slate-700"
                >
                  Paste Full Job Description Text
                </label>
                <span className="text-[11px] text-slate-400">
                  {jobDescription.length} characters
                </span>
              </div>
              <textarea
                id="job-description"
                rows={12}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job post here (responsibilities, qualifications, tech stack)..."
                className="w-full flex-1 min-h-[280px] text-xs p-3 font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D26A] focus:border-[#00D26A] leading-relaxed resize-none"
              />
            </div>
          </div>
        </div>

        {/* CTA bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-[#00D26A] to-teal-500 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Ready to tailor your resume?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Our AI will align your experience to this job description, inject
              missing ATS keywords, and rewrite bullets for impact.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 hover:bg-slate-50 font-bold text-base rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin text-[#00D26A]" />
                <span>Analyzing & Tailoring...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-[#00D26A]" />
                <span>Tailor Resume with AI</span>
                <ArrowRight className="w-5 h-5 text-[#00D26A]" />
              </>
            )}
 </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeTailor;
