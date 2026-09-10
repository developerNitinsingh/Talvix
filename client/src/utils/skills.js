export const normalizeSkills = (skills = []) =>
  skills
    .map((entry) => {
      if (typeof entry === "string") {
        return { category: "Skills", skill: entry };
      }

      const value = Array.isArray(entry?.skills)
        ? entry.skills.join(", ")
        : entry?.skill || entry?.skills;

      if (!value) return null;

      return {
        category: entry.category || "Skills",
        skill: value,
      };
    })
    .filter(Boolean);
