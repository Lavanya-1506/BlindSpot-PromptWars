# THE BLIND SPOT
### AI-Powered Critical-Thinking Companion
*PromptWars × Build with AI (Google for Developers) × Hack2Skill*

> **The Line That Decides Everything:**  
> *"The AI may point at a dimension the user has not examined. It may NOT introduce, favor, or hint at an option. The system must NEVER make the decision for the user."*

---

## 1. Executive Summary

People make decisions based on what is most visible to them. In doing so, they fall victim to **salience bias**, rely on **unstated assumptions**, and overlook **internal contradictions** in their own reasoning.

**The Blind Spot** is an AI-powered thinking companion. Rather than acting as an oracle or prescriptive advisor that dictates *"Choose Option A"*, it deconstructs the user's decision narrative, illuminates silent dimensions, quotes the user's own words back to them, and poses symmetric, non-leading Socratic inquiries.

---

## 2. Monochromatic Color Architecture

The entire UI is built on a pure **Monochromatic Grayscale Gradient Ramp** relying strictly on luminosity contrast and typographic hierarchy:

| Token | Hex Value | Semantic Role in UI |
| :--- | :--- | :--- |
| **Bright Pure Chalk** | `#F9F9F6` | Primary headings, button accents, high-contrast highlights |
| **Soft Platinum** | `#D4D4D4` | Primary body text, secondary highlights |
| **Mid Platinum** | `#B5B5B5` | Muted badges, secondary metrics, subtle indicators |
| **Neutral Grey** | `#969696` | Tertiary labels, placeholders, timestamps |
| **Pewter Grey** | `#797979` | Mid-tone surface overlays, interactive hover borders |
| **Charcoal Grey** | `#5E5E5E` | Active card borders, component outlines |
| **Dark Slate** | `#434343` | Elevated headers, popovers, modal bars |
| **Obsidian / Carbon** | `#2B2B2B` | Primary card background, panel surfaces |
| **Deep Jet Void** | `#181818` | Primary dark background canvas |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React + Vite Frontend                    │
│   (3-Pane Layout: Presets Sidebar, Stage & Findings Panel)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend Engine                    │
│  - Input Sanitizer & Length/Crisis Filter                   │
│  - Anti-Advice Regex Guardrail                              │
│  - Quote Grounding Validator                                │
│  - Pydantic v2 Schema Enforcement                           │
└──────────────────────────────┬──────────────────────────────┘
                               │ Structured JSON Prompt
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            Google Gemini API (3.8 / 2.0 Flash)              │
│       - Low Temperature (0.35) for Analytical Grounding     │
│       - Non-Directive System Prompt & Few-Shot Framing      │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Core Features

### F1: Decision Intake & Clarifier
- Accepts free-text narratives from 20 to 3000 characters.
- Detects sparse inputs (<20 words) and returns a clarifying question to gather missing context rather than hallucinating assumptions.

### F2: Quote-Grounded Assumption Register
- Surfaces unstated hypotheses.
- **Strict Verifiable Quote Rule:** Every assumption must cite an exact verbatim quote (`evidence_quote`) from the user's text.
- Interactive user actions: `[I Assume This]`, `[Not True]`, `[Hadn't Thought of It]` + optional verification notes.

### F3: Overlooked Dimensions Lens
- Systematic scan across 8 categories: Financial, Academic/Skills, Wellbeing, Stakeholders, Time/Reversibility, Long-Term Path, Information Gaps, Values.
- Describes the *absence/silence* of the topic, never prescribing what action to take.

### F4: Internal Reasoning Contradictions
- Compares conflicting statements (`quote_a` vs `quote_b`) in a side-by-side card with a neutral analysis of cognitive tension.

### F5: Symmetric Socratic Questioning
- Generates 4–6 open-ended questions applying equally across all alternatives.
- Blocks leading language (`Why not...`, `Don't you think...`).
- Interactive reflection allows users to answer questions and deepen the analysis.

### F6: Anti-Advice Guardrail Engine
- Dual-pass filter (System Prompt Constraints + Regex Interceptor).
- Blocks verdict language (`you should`, `I recommend`, `best option is`).
- Guarantees zero recommendations across all outputs.

### F7: Decision Brief Export (Markdown & PDF)
- Compiles the verified assumption register, overlooked dimensions, and reflections into an executive brief.
- Instant client-side Markdown blob download (`assumption-report-YYYY-MM-DD.md`).
- Print-optimized CSS for clean browser PDF generation with zero server storage.

### F8: Automated Evaluation Lab
- Built-in benchmark runner executing test suites against the official internship scenario and adversarial prompt injection.

---

## 5. Quickstart & Running Locally

### Prerequisites
- Python 3.9+
- Node.js 18+ and npm

### 1. Backend Setup
```bash
# Navigate to backend and activate virtualenv
python3 -m venv backend/venv
source backend/venv/bin/activate
pip install -r backend/requirements.txt

# Run backend test suite
PYTHONPATH=backend pytest backend/tests

# Start FastAPI server (serves API and compiled frontend)
PYTHONPATH=backend uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### 2. Frontend Development (Optional for live hot-reload)
```bash
cd frontend
npm install
npm run dev
# Vite runs on http://localhost:5173 with proxy to backend
```

---

## 6. Automated Benchmark Verification Results

| Benchmark Test Scenario | Metric | Result | Status |
| :--- | :--- | :--- | :--- |
| **Official 6-Month Internship Case** | Quote Grounding Rate | 100% (All assumptions cite exact user quotes) | **PASS** |
| **Official 6-Month Internship Case** | Recommendation Count | 0 (Zero verdict phrases detected) | **PASS** |
| **Adversarial Advice Injection** | Guardrail Interception | 100% (Direct advice request blocked & redirected) | **PASS** |
| **Unit Test Suite (Pytest)** | Test Cases Passed | 9 of 9 passed in 0.28s | **PASS** |