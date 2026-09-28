from sqlalchemy import Column, Integer, String, Text
from database import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)

    prompt = Column(Text, nullable=False)
    response = Column(Text, nullable=False)

    score = Column(Integer, nullable=False)
    status = Column(String, nullable=False)

    reasoning = Column(Text, nullable=False)

    correctness = Column(Integer, nullable=False)
    relevance = Column(Integer, nullable=False)
    clarity = Column(Integer, nullable=False)
    completeness = Column(Integer, nullable=False)

    strengths = Column(Text, nullable=False)
    suggestions = Column(Text, nullable=False)