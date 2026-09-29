# AI Response Evaluation Platform

A full-stack AI evaluation platform for analyzing and scoring AI-generated responses across multiple quality dimensions.

The platform allows users to submit a prompt and an AI-generated response, then uses an AI evaluation engine to assess the response for correctness, relevance, clarity, and completeness.

## Features

- AI-powered response evaluation
- Overall response score from 0–100
- Pass / Needs Review / Failed evaluation status
- Evaluation across four quality dimensions:
  - Correctness
  - Relevance
  - Clarity
  - Completeness
- AI-generated reasoning
- Identified response strengths
- Improvement suggestions
- Persistent evaluation history
- Search and filter evaluation history
- Dashboard with evaluation statistics
- Dynamic quality metrics
- Light and dark themes
- Responsive SaaS-style interface
- FastAPI backend
- SQLite database persistence
- OpenAI API integration

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- SQLAlchemy

### AI

- OpenAI API

### Database

- SQLite

### Development & Testing

- Git
- GitHub
- Pytest

## How It Works

1. A user enters a prompt and an AI-generated response.
2. The frontend sends the evaluation request to the FastAPI backend.
3. The backend sends the content to the AI evaluation engine.
4. The response is evaluated across four quality dimensions.
5. The system generates:
   - Overall score
   - Evaluation status
   - Reasoning
   - Strengths
   - Suggestions
6. The evaluation is saved to the database.
7. The dashboard and evaluation history update with the new result.

## Evaluation Dimensions

| Dimension | Description |
|---|---|
| Correctness | Measures whether the response is factually and logically correct. |
| Relevance | Measures whether the response directly addresses the user's prompt. |
| Clarity | Measures how clearly and understandably the response is written. |
| Completeness | Measures whether the response sufficiently covers the requested information. |

## Project Structure

```text
AI Evaluation Platform/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── evaluations.db
│
├── src/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── public/
├── .env.example
├── .gitignore
├── package.json
├── vite.config.ts
└── README.md