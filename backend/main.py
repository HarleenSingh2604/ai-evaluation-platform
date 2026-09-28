from dotenv import load_dotenv
from openai import OpenAI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import Base, engine, SessionLocal
from models import Evaluation

load_dotenv()

client = OpenAI()

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EvaluationRequest(BaseModel):
    prompt: str
    response: str


class EvaluationResult(BaseModel):
    score: int
    status: str
    reasoning: str
    correctness: int
    relevance: int
    clarity: int
    completeness: int
    strengths: list[str]
    suggestions: list[str]


@app.get("/")
def root():
    return {"message": "AI Evaluation Platform API is running"}


@app.post("/evaluate", response_model=EvaluationResult)
def evaluate(request: EvaluationRequest):

    evaluation_prompt = f"""
You are an expert AI response evaluator.

Evaluate the AI response against the user's original prompt.

User prompt:
{request.prompt}

AI response:
{request.response}

Evaluate these four dimensions:

1. Correctness - Is the information accurate and logically sound?
2. Relevance - Does the response directly address the user's request?
3. Clarity - Is it easy to understand, well organized, and unambiguous?
4. Completeness - Does it adequately cover what the user asked for?

Give each dimension a score from 0 to 100.

Then calculate an overall score from 0 to 100.

Use this status rule:
- Passed: overall score >= 70
- Needs Review: overall score between 50 and 69
- Failed: overall score < 50

Provide:
- A concise reasoning explaining the overall evaluation
- 2 to 4 specific strengths
- 1 to 3 useful suggestions for improvement

Return only the requested structured evaluation.
"""

    result = client.responses.parse(
        model="gpt-5.6-luna",
        input=[
            {
                "role": "system",
                "content": "You evaluate AI responses objectively and consistently.",
            },
            {
                "role": "user",
                "content": evaluation_prompt,
            },
        ],
        text_format=EvaluationResult,
    )

    evaluation = result.output_parsed

    db = SessionLocal()

    try:
        db_evaluation = Evaluation(
            prompt=request.prompt,
            response=request.response,
            score=evaluation.score,
            status=evaluation.status,
            reasoning=evaluation.reasoning,
            correctness=evaluation.correctness,
            relevance=evaluation.relevance,
            clarity=evaluation.clarity,
            completeness=evaluation.completeness,
            strengths="\n".join(evaluation.strengths),
            suggestions="\n".join(evaluation.suggestions),
        )

        db.add(db_evaluation)
        db.commit()

        return evaluation

    finally:
        db.close()

@app.get("/evaluations")
def get_evaluations():
    db = SessionLocal()

    try:
        evaluations = (
            db.query(Evaluation)
            .order_by(Evaluation.id.desc())
            .all()
        )

        return [
            {
                "id": evaluation.id,
                "prompt": evaluation.prompt,
                "response": evaluation.response,
                "score": evaluation.score,
                "status": evaluation.status,
                "reasoning": evaluation.reasoning,
                "correctness": evaluation.correctness,
                "relevance": evaluation.relevance,
                "clarity": evaluation.clarity,
                "completeness": evaluation.completeness,
                "strengths": evaluation.strengths.split("\n"),
                "suggestions": evaluation.suggestions.split("\n"),
            }
            for evaluation in evaluations
        ]

    finally:
        db.close()