const SKILLS = [
  "HTML","CSS","JavaScript","TypeScript","React","Angular","Vue","Node.js","Express",
  "Java","Python","C++","C#","PHP","SQL","MySQL","MongoDB","PostgreSQL",
  "REST API","Git","GitHub","Docker","AWS","Azure","Firebase","Jest","Cypress",
  "Bootstrap","Tailwind CSS","Figma","UI/UX","Agile","Problem Solving","Communication"
];

const normalize = value => value.toLowerCase().replace(/[^a-z0-9+#.]/g, " ").replace(/\s+/g, " ").trim();

export function analyzeResume(resumeText, jobText) {
  const resume = normalize(resumeText);
  const job = normalize(jobText);
  const jobSkills = SKILLS.filter(skill => job.includes(normalize(skill)));
  const resumeSkills = SKILLS.filter(skill => resume.includes(normalize(skill)));
  const relevantSkills = jobSkills.length ? jobSkills : resumeSkills;
  const matched = relevantSkills.filter(skill => resume.includes(normalize(skill)));
  const missing = relevantSkills.filter(skill => !resume.includes(normalize(skill)));
  const score = relevantSkills.length ? Math.round((matched.length / relevantSkills.length) * 100) : 0;
  const words = resumeText.trim().split(/\s+/).filter(Boolean).length;

  const suggestions = [];
  if (words < 150) suggestions.push("Your resume text looks short. Add relevant project details, responsibilities and measurable outcomes where appropriate.");
  if (words > 900) suggestions.push("Consider making the resume more concise and prioritizing the most relevant experience.");
  if (matched.length) suggestions.push("Use the matching skills naturally in your skills section and in relevant project or experience descriptions.");
  if (missing.length) suggestions.push("Review the missing skills list. Add a skill only if you genuinely have that skill or relevant experience.");
  if (!/education|degree|university|college/i.test(resumeText)) suggestions.push("Consider adding an Education section with your degree, institution and graduation year.");
  if (!/project/i.test(resumeText)) suggestions.push("Add a Projects section describing what you built, the technologies used and your contribution.");
  if (!/experience|internship|employment/i.test(resumeText)) suggestions.push("If applicable, include internships, volunteering or practical experience.");
  if (!/email|@/.test(resumeText)) suggestions.push("Check that your contact details include a professional email address.");
  if (!suggestions.length) suggestions.push("Your resume contains several useful sections. Review each job requirement and tailor your examples to the role.");

  return { score, matched, missing, jobSkills: relevantSkills, words, suggestions, analyzedAt: new Date().toISOString() };
}

export function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char]));
}
