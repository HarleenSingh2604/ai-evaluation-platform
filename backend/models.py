from sqlalchemy import Column, Integer, String, Text, ForeignKey
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

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