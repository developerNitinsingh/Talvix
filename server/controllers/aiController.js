import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

// controller for enhancing a resume's professional summary using AI
// POST : /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res
        .status(400)
        .json({ message: "Please provide the content to enhance" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_API_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience and career objectives. Make it compelling and ATS-friendly. and only return text no options orr anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedSummary = response.choices[0].message.content;

    return res.status(200).json({
      message: "Professional summary enhanced successfully",
      enhancedSummary,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Error in enhancing professional summary",
    });
  }
};

// controller for enhancing a resume's job description using AI
// POST : /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res
        .status(400)
        .json({ message: "Please provide the content to enhance" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_API_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be 1-2 sentences also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it compelling and ATS-friendly. and only return text no options or anything else",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedJobDescription = response.choices[0].message.content;

    return res.status(200).json({
      message: "Professional summary enhanced successfully",
      enhancedJobDescription,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Error in enhancing  job description",
    });
  }
};

// controller for uploading a resume to the database
// POST : /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    // console.log(req.body);

    const userId = req.userId;
    // console.log(resumeText, title);

    if (!resumeText) {
      return res
        .status(400)
        .json({ message: "Please provide the resume text to upload" });
    }

    const systemPrompt =
      "You are an expert AI Agent to extract data from resume";

    const userPrompt = `Extract data from this resume: ${resumeText} 
    
    Provide data in the following JSON format with no additional text before or after:
    {
    professional_summary: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
      },
    ],

    personal_info: {
      image: {
        type: String,
        default: "",
      },
      full_name: {
        type: String,
        default: "",
      },
      profession: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },

    experience: [
      {
        company: { type: String },
        position: { type: String },
        start_date: { type: String },
        end_date: { type: String },
        description: { type: String },
        is_current: { type: Boolean },
      },
    ],

    project: [
      {
        name: { type: String },
        type: { type: String },
        description: { type: String },
      },
    ],
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        field: { type: String },
        graduation_date: { type: String },
        gpa: { type: String },
      },
    ],
    }
    `;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_API_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],

      response_format: {
        type: "json_object",
      },
    });

    if (!response) {
      return res.status(400).json({
        message: "Response from AI is empty. Please try again.",
      });
    }

    const extractedData = response.choices[0].message.content;
    // console.log("extractedData", extractedData);

    const parsedData = JSON.parse(extractedData);
    const newResume = await Resume.create({ userId, title, ...parsedData });

    // console.log("res:", res);

    return res.status(200).json({
      message: " Resume uploaded and data extracted successfully",
      resumeId: newResume._id,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Error in uploading resume",
    });
  }
};

// controller for extracting data from a resume using AI and update that based on Job description
// POST : /api/ai/extract-update-resume
export const extractAndUpdateResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    const userId = req.userId;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message: "Please provide both resume text and job description",
      });
    }

    const systemPrompt =
      "You are an expert AI Agent to extract data from resume";

    const userPrompt = `

    You are an expert Executive Resume Writer and Applicant Tracking System (ATS) Optimization Specialist.
    Your task is to tailor the candidate's existing resume to perfectly match the provided Job Description.
    RESUME CONTENT:
    Extract data from this resume: ${resumeText} 
    JOB DESCRIPTION: ${jobDescription}

      INSTRUCTIONS:
      1. Re-write the Summary statement to highlight alignment with the job requirements using key phrases from the JD.
      2. Rewrite Work Experience bullet points:
        - Use strong action verbs (e.g., Architected, Optimized, Spearheaded, Engineered).
        - Inject relevant keywords from the job description naturally.
        - Quantify achievements with metrics, percentages, or scale where reasonable.
        - Keep truthfulness while maximizing impact and ATS matching.
      3. Identify relevant hard skills and tools from the JD and ensure they appear in the skills list.
      4. Calculate realistic ATS Match Scores (0-100) before and after tailoring.
      5. Provide a keyword analysis listing matched skills, missing target keywords, and key improvements made.

    Provide data in the following JSON format with no additional text before or after:
    {
    professional_summary: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
      },
    ],

    personal_info: {
      image: {
        type: String,
        default: "",
      },
      full_name: {
        type: String,
        default: "",
      },
      profession: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },

    experience: [
      {
        company: { type: String },
        position: { type: String },
        start_date: { type: String },
        end_date: { type: String },
        description: { type: String },
        is_current: { type: Boolean },
      },
    ],

    project: [
      {
        name: { type: String },
        type: { type: String },
        description: { type: String },
      },
    ],
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        field: { type: String },
        graduation_date: { type: String },
        gpa: { type: String },
      },
    ],
    }
    `;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_API_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],

      response_format: {
        type: "json_object",
      },
    });

    if (!response) {
      return res.status(400).json({
        message: "Response from AI is empty. Please try again.",
      });
    }

    const extractedData = response.choices[0].message.content;

    const parsedData = JSON.parse(extractedData);

    const newResume = await Resume.create({ userId, ...parsedData });

    return res.status(200).json({
      message: " Resume uploaded and data extracted successfully",
      resumeId: newResume._id,
      resumeData: newResume,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Error in extracting and updating resume",
    });
  }
};
