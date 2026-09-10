import { Mail, Phone, Globe } from "lucide-react";
import { normalizeSkills } from "../../utils/skills";

const NewTemplate = ({ data, accentColor }) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 leading-relaxed">
      {/* Header Section */}
      <header
        className="text-center mb-6 pb-5 border-b-2"
        style={{ borderColor: accentColor }}
      >
        <h1
          className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight mb-1"
          style={{ color: accentColor }}
        >
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        {data.personal_info?.title && (
          <p className="text-sm font-semibold tracking-widest text-gray-600 mb-3 uppercase">
            {data.personal_info.title}
          </p>
        )}

        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-gray-600 font-medium">
          {data.personal_info?.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <a
                href={`mailto:${data.personal_info.email}`}
                className="hover:underline"
              >
                Email: {data.personal_info.email}
              </a>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              <span>Phone: {data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <a
                href={`https://${data.personal_info.website}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Portfolio: {data.personal_info.website}
              </a>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <a
                href={`https://${data.personal_info.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                GitHub: {data.personal_info.linkedin}
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data.professional_summary && (
        <section className="mb-5">
          <h2
            className="text-base font-bold mb-2 tracking-wider uppercase border-b pb-1"
            style={{ color: accentColor, borderColor: `${accentColor}33` }}
          >
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-justify">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Technical Skills */}
      {data.skills && normalizeSkills(data.skills).length > 0 && (
        <section className="mb-5">
          <h2
            className="text-base font-bold mb-2.5 tracking-wider uppercase border-b pb-1"
            style={{ color: accentColor, borderColor: `${accentColor}33` }}
          >
            TECHNICAL SKILLS
          </h2>
          <div className="space-y-1.5 text-sm">
            {normalizeSkills(data.skills).map((skillGroup, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-2"
              >
                <span className="font-semibold text-gray-900 sm:col-span-3">
                  {skillGroup.category}:
                </span>
                <span className="text-gray-700 sm:col-span-9">
                  {skillGroup.skill}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {data.project && data.project.length > 0 && (
        <section className="mb-5">
          <h2
            className="text-base font-bold mb-3 tracking-wider uppercase border-b pb-1"
            style={{ color: accentColor, borderColor: `${accentColor}33` }}
          >
            FEATURED PROJECTS
          </h2>

          <div className="space-y-4">
            {data.project.map((proj, index) => (
              <div key={index}>
                <div className="flex flex-wrap justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900 text-base">
                    {proj.name}
                  </h3>
                  {proj.projectLiveLink && (
                    <a href={proj.projectLiveLink} className="">
                      <span className="text-xs font-semibold text-gray-600">
                        {proj.projectLiveLink}
                      </span>
                    </a>
                  )}
                </div>
                {proj.description_in_points && (
                  <ul className="list-disc list-outside ml-5 space-y-1 text-sm text-gray-700">
                    {proj.description_in_points.map((bullet, idx) => (
                      <li key={idx} className="leading-snug">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Activities */}
      {data.education && data.education.length > 0 && (
        <section className="mb-5">
          <h2
            className="text-base font-bold mb-3 tracking-wider uppercase border-b pb-1"
            style={{ color: accentColor, borderColor: `${accentColor}33` }}
          >
            EDUCATION & ACTIVITIES
          </h2>

          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex flex-wrap justify-between items-start mb-0.5">
                  <h3 className="font-bold text-gray-900 text-base">
                    {edu.institution}
                  </h3>
                  {edu.location && (
                    <span className="text-xs text-gray-600 font-medium">
                      {edu.location}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap justify-between items-center mb-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {edu.degree}
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    {edu.period}
                  </p>
                </div>
                {edu.details && (
                  <ul className="list-disc list-outside ml-5 space-y-1 text-sm text-gray-700">
                    {edu.details.map((detail, idx) => (
                      <li key={idx} className="leading-snug">
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Strengths & Competencies */}
      {data.key_strengths && data.key_strengths.length > 0 && (
        <section className="mb-2">
          <h2
            className="text-base font-bold mb-2.5 tracking-wider uppercase border-b pb-1"
            style={{ color: accentColor, borderColor: `${accentColor}33` }}
          >
            KEY STRENGTHS & COMPETENCIES
          </h2>

          <ul className="list-disc list-outside ml-5 space-y-1.5 text-sm text-gray-700">
            {data.key_strengths.map((item, index) => (
              <li key={index} className="leading-snug">
                <strong className="text-gray-900">{item.title}:</strong>{" "}
                {item.description}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default NewTemplate;
