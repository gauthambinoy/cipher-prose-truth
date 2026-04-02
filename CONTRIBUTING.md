# Contributing to ClarityAI

## Setup
```bash
# Backend
cd backend && pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```

## Architecture
ClarityAI uses a 17-signal ensemble pipeline:
- Each signal is an independent detector (perplexity, burstiness, vocabulary richness, etc.)
- Signals are weighted and combined for final AI probability score
- The humanization engine applies multi-pass text transformation

## Adding a New Detection Signal
1. Create a new signal function in the detection module
2. Register it in the ensemble pipeline
3. Calibrate weights against the test dataset
4. Add unit tests for the new signal
5. Update signal count in README

## Code Style
- **Python**: PEP 8, enforced by `ruff`
- **TypeScript**: ESLint + Prettier
- **Commits**: Conventional commits
