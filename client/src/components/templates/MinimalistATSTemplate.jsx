import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { normalizeSkills } from "../../utils/skills";

const MinimalistATSTemplate = ({ data, accentColor = "#0f172a" }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 font-sans leading-normal">
      {/* Header */}
      <header className="mb-6 pb-4 border-b border-gray-400">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          {data.personal_info?.full_name || "Your Name"}
        </h1>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          {data.personal_info?.email && (
            <span className="flex items-center gap-1">
              <Mail className="size-3.5" />
              {data.personal_info.email}
            </span>
          )}
          {data.personal_info?.phone && (
            <span className="flex items-center gap-1">
              <Phone className="size-3.5" />
              {data.personal_info.phone}
            </span>
          )}
          {data.personal_info?.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {data.personal_info.location}
            </span>
          )}
          {data.personal_info?.linkedin && (
            <span className="flex items-center gap-1">
              <Globe className="size-3.5" />
              {data.personal_info.linkedin}
            </span>
          )}
          {data.personal_info?.website && (
            <span className="flex items-center gap-1">
              <Globe className="size-3.5" />
              {data.personal_info.website}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.professional_summary && (
        <section className="mb-6">
          <h2
            className="text-md font-bold uppercase tracking-wide pb-1 mb-2 border-b-2"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Executive Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-md font-bold uppercase tracking-wide pb-1 mb-3 border-b-2"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">
                    {exp.position}
                  </span>
                  <span className="text-xs text-gray-600 font-semibold">
                    {formatDate(exp.start_date)} –{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  {exp.company}
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed pt-1">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-md font-bold uppercase tracking-wide pb-1 mb-2 border-b-2"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Technical & Professional Skills
          </h2>
          <div className="flex flex-wrap gap-2 pt-1">
            {normalizeSkills(data.skills).map((skill, index) => (
              <span
                key={index}
                className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-800 rounded border border-gray-200"
              >
                {skill.skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.project && data.project.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-md font-bold uppercase tracking-wide pb-1 mb-3 border-b-2"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Relevant Projects
          </h2>
          <div className="space-y-3">
            {data.project.map((proj, index) => (
              <div key={index}>
                <h3 className="text-sm font-bold text-gray-900">{proj.name}</h3>
                <p className="text-sm text-gray-700">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-md font-bold uppercase tracking-wide pb-1 mb-3 border-b-2"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Education & Qualifications
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-sm text-gray-700">{edu.institution}</p>
                  {edu.gpa && (
                    <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
                  )}
                </div>
                <span className="text-xs text-gray-600 font-semibold">
                  {formatDate(edu.graduation_date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalistATSTemplate;
