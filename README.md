# ResumeIQ — AI-Powered Resume Analyzer (Frontend Demo)

A responsive, browser-based resume analyzer built with HTML, CSS and JavaScript. It extracts text from PDF/TXT resumes, compares skills found in a job description, displays a keyword-overlap score, suggests improvements and stores the latest analyses in browser LocalStorage.

## Important project scope

This version uses a **rule-based keyword and skill matching engine**, not a real AI model. The score is an educational keyword-overlap indicator, not a guaranteed ATS score or hiring prediction. Resume files are processed locally in the browser; no server or database receives them.

## Features

- PDF and TXT resume upload (5 MB limit)
- Paste resume text manually
- Job-description comparison
- Skill matching and missing-skill list
- Keyword-overlap percentage
- Chart.js visualization
- Resume improvement suggestions
- Downloadable text report
- Recent analysis history using LocalStorage
- Responsive desktop and mobile layout

## Run locally

Because the app uses JavaScript modules, run it through a local web server rather than opening `index.html` directly.

### Option A: VS Code
1. Open this folder in Visual Studio Code.
2. Install the **Live Server** extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

### Option B: Python local server
Run this command from the project folder:

```bash
python -m http.server 5500
```

Open `http://localhost:5500` in your browser.

## Project structure

```text
AI-Resume-Analyzer/
├── index.html
├── css/style.css
├── js/app.js
├── js/analyzer.js
├── js/pdf-reader.js
├── js/storage.js
├── assets/
├── README.md
└── .gitignore
```

## Test checklist

1. Click **Load sample**, then **Analyze resume**. Confirm score, chips, chart and suggestions appear.
2. Try analysis with an empty resume. A validation message should appear.
3. Try analysis with an empty job description. A validation message should appear.
4. Upload a text-based PDF and confirm extracted text appears in the textarea.
5. Upload a TXT file and confirm its text appears.
6. Try a file larger than 5 MB. It should be rejected.
7. Change the job description and analyze again. The score and skill lists should update.
8. Download the report and verify its contents.
9. Refresh the page. Recent analysis history should remain.
10. Clear history and refresh. The history should be empty.
11. Test the layout at mobile and desktop widths.
12. Test in current Chrome, Edge and Firefox.

## Known limitations

- Scanned/image-only PDFs need OCR; this version extracts selectable PDF text.
- Skill detection uses a fixed skill dictionary and simple text matching.
- LocalStorage is browser-specific and is not a secure long-term database.
- No accounts, cloud sync, backend, real AI model or payment features are included.
- CDN libraries and Google Fonts require an internet connection.

## Suggested future enhancements

- Add a backend API and secure user accounts.
- Integrate a real AI model through a server-side API (never expose private API keys in frontend JavaScript).
- Add OCR for scanned PDFs.
- Expand the skill dictionary and support synonyms.
- Add unit tests for the analysis engine.
- Add automated accessibility and cross-browser checks.

## Resume description

**ResumeIQ — Browser-Based Resume Analyzer**
- Developed a responsive resume analysis web application using HTML5, CSS3 and JavaScript.
- Integrated PDF.js to extract selectable text from PDF resumes in the browser.
- Implemented job-description keyword matching, skill-gap detection and actionable resume suggestions.
- Visualized analysis results with Chart.js and added report export and LocalStorage-based history.
- Designed client-side validation and responsive layouts for desktop and mobile devices.

Only list features you have personally tested and can explain in an interview.
