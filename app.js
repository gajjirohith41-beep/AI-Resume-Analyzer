import { analyzeResume, escapeHtml } from "./analyzer.js";
import { readResumeFile } from "./pdf-reader.js";
import { getHistory, saveHistory, clearHistory } from "./storage.js";

const $ = id => document.getElementById(id);
let latestReport = null;
let chart = null;

const sampleResume = `Alex Morgan
alex.morgan@email.com | Hyderabad, India
SUMMARY
Frontend developer with experience building responsive web applications.
SKILLS
HTML, CSS, JavaScript, React, Git, REST API, SQL, Problem Solving
PROJECTS
Resume Analyzer: Built a responsive resume analysis interface using JavaScript.
E-commerce UI: Created product filters, shopping cart interactions and responsive layouts.
EDUCATION
Bachelor of Technology in Computer Science`;

const sampleJob = `Frontend Developer
We are looking for a developer with HTML, CSS, JavaScript, React, REST API and Git.
Experience with responsive design, UI/UX, TypeScript, testing and problem solving is preferred.
Strong communication and teamwork skills are important.`;

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2600);
}

function renderChips(target, items, missing = false) {
  target.innerHTML = items.length
    ? items.map(item => `<span class="chip ${missing ? "missing" : ""}">${escapeHtml(item)}</span>`).join("")
    : `<span class="muted">No ${missing ? "missing" : "matching"} skills detected.</span>`;
}

function renderChart(report) {
  const ctx = $("skillsChart");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Matched skills", "Missing skills"],
      datasets: [{ data: [report.matched.length, report.missing.length], backgroundColor: ["#4169e1", "#e8edf5"], borderWidth: 0 }]
    },
    options: { responsive: true, cutout: "70%", plugins: { legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 7, font: { size: 11 } } } } }
  });
}

function renderReport(report, title) {
  latestReport = { ...report, title };
  $("results").classList.remove("hidden");
  $("reportSubtitle").textContent = `${title || "Target role"} · Analyzed ${new Date(report.analyzedAt).toLocaleString()}`;
  $("matchScore").textContent = `${report.score}%`;
  $("matchLabel").textContent = report.score >= 75 ? "Strong keyword overlap" : report.score >= 45 ? "Some alignment" : "Needs review";
  $("matchBar").style.width = `${report.score}%`;
  $("skillsFound").textContent = report.matched.length;
  $("skillsMissing").textContent = report.missing.length;
  $("wordCount").textContent = report.words;
  renderChips($("matchedSkills"), report.matched);
  renderChips($("missingSkills"), report.missing, true);
  $("suggestions").innerHTML = report.suggestions.map(s => `<li>${escapeHtml(s)}</li>`).join("");
  renderChart(report);
  $("results").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderHistory() {
  const history = getHistory();
  $("historyList").innerHTML = history.length ? history.map(item =>
    `<div class="history-item"><strong>${escapeHtml(item.title || "Resume analysis")}</strong><span>${item.score}% match · ${new Date(item.analyzedAt).toLocaleDateString()}</span></div>`
  ).join("") : `<p class="muted">Your saved analyses will appear here.</p>`;
}

$("resumeFile").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;
  $("fileName").textContent = file.name;
  try {
    $("resumeText").value = await readResumeFile(file);
    toast("Resume text extracted successfully.");
  } catch (error) {
    $("fileName").textContent = "No file selected";
    toast(error.message);
  }
});

const dropzone = $("dropzone");
dropzone.addEventListener("dragover", event => { event.preventDefault(); dropzone.classList.add("dragover"); });
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
dropzone.addEventListener("drop", async event => {
  event.preventDefault();
  dropzone.classList.remove("dragover");
  const file = event.dataTransfer.files[0];
  if (!file) return;
  $("resumeFile").files = event.dataTransfer.files;
  $("fileName").textContent = file.name;
  try { $("resumeText").value = await readResumeFile(file); toast("Resume text extracted successfully."); }
  catch (error) { toast(error.message); }
});

$("sampleBtn").addEventListener("click", () => {
  $("resumeText").value = sampleResume;
  $("jobTitle").value = "Frontend Developer";
  $("jobDescription").value = sampleJob;
  $("fileName").textContent = "Sample resume loaded";
  toast("Sample content loaded. Select Analyze resume.");
});

$("analyzeBtn").addEventListener("click", () => {
  const resume = $("resumeText").value.trim();
  const job = $("jobDescription").value.trim();
  if (!resume) return toast("Upload a resume or paste resume text first.");
  if (!job) return toast("Please enter a job description.");
  if (resume.length < 40) return toast("Please provide more resume text for a useful analysis.");
  if (job.length < 30) return toast("Please enter a more detailed job description.");
  const report = analyzeResume(resume, job);
  const title = $("jobTitle").value.trim() || "Resume analysis";
  saveHistory({ title, score: report.score, analyzedAt: report.analyzedAt });
  renderReport(report, title);
  renderHistory();
});

$("downloadBtn").addEventListener("click", () => {
  if (!latestReport) return;
  const r = latestReport;
  const content = [
    "RESUMEIQ ANALYSIS REPORT",
    `Target role: ${r.title}`,
    `Date: ${new Date(r.analyzedAt).toLocaleString()}`,
    `Keyword match: ${r.score}%`,
    `Resume word count: ${r.words}`,
    `Matched skills: ${r.matched.join(", ") || "None"}`,
    `Missing skills: ${r.missing.join(", ") || "None"}`,
    "",
    "SUGGESTIONS",
    ...r.suggestions.map((s, i) => `${i + 1}. ${s}`),
    "",
    "Note: This is a browser-based keyword comparison, not a certified ATS score or professional hiring decision."
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "resume-analysis-report.txt"; a.click();
  URL.revokeObjectURL(url);
});

$("clearHistoryBtn").addEventListener("click", () => {
  clearHistory();
  renderHistory();
  toast("Analysis history cleared from this browser.");
});

renderHistory();
