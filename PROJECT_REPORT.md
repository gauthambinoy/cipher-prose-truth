# ClarityAI Project Report

## Executive summary

ClarityAI is a portfolio-grade AI content analysis application focused on practical NLP engineering: FastAPI services, React/TypeScript product UX, Dockerized local development, CI validation, and free-tier deployment instructions.

Live frontend: https://clarityai-pied.vercel.app
Hosted API docs: https://gxm00009-clarityai.hf.space/api/v1/docs

## Product scope

- AI-writing signal detection with multiple statistical, stylometric, pattern, and model-backed detectors.
- Readability, tone, grammar, SEO, citation, paraphrase, comparison, and text-statistics analytics.
- Batch-analysis, dashboard, history, export/share, and optional Ollama-assisted humanization workflows.
- Local and hosted deployment paths using Docker, Vercel, Hugging Face Spaces, and Render.

## Engineering highlights

| Area | Evidence |
|---|---|
| Backend | FastAPI app factory, async SQLAlchemy/SQLite, typed route schemas, health and history endpoints. |
| Frontend | React 18, TypeScript, Vite, MUI, Zustand, TanStack Query, Vitest tests. |
| ML/NLP | Detector interfaces, ensemble scorer, spaCy/NLTK/transformers integration, lazy model loading. |
| DevOps | Dockerfiles, docker-compose health checks, GitHub Actions CI, env examples, deployment config. |
| Quality | Backend pytest coverage gate, Ruff/Black checks, frontend unit tests and production build. |

## Accuracy caveat

AI detection is probabilistic. Scores should be treated as editorial signals, not proof of authorship. False positives and false negatives are expected, especially with short passages, heavily edited text, templates, domain jargon, or non-native writing.

## Current validation baseline

- Backend: Ruff, Black, and 66 pytest tests pass with coverage above the configured 20% CI gate.
- Frontend: 46 Vitest tests pass and Vite production build succeeds.
- Docker: Backend image is covered by CI smoke-test configuration.

## Recruiter demo script

1. Open the live frontend and run a 100+ word sample through AI Detection.
2. Explain the score, signal breakdown, sentence heatmap, and caveats.
3. Open Analytics and show readability/tone/statistics responses.
4. Open FastAPI docs to demonstrate typed API contracts.
5. Point to `README.md`, `docs/ARCHITECTURE.md`, `docs/sample-detection-report.json`, and CI config.

## Recommended next polish

1. Capture three screenshots and one short GIF under `docs/screenshots/`.
2. Add a pinned GitHub repository description: `AI content analysis platform — FastAPI, React, NLP, Docker, CI, Vercel/HF demo`.
3. Raise backend coverage toward 50% by adding tests for analytics, export, and advanced routes.
