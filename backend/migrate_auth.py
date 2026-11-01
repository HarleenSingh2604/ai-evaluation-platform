from sqlalchemy import text
from database import engine, Base
from models import User, Evaluation

print("Creating new authentication tables...")

Base.metadata.create_all(bind=engine)

with engine.connect() as connection:
    columns = connection.execute(
        text("PRAGMA table_info(evaluations)")
    ).fetchall()

    column_names = [column[1] for column in columns]

    if "user_id" not in column_names:
        connection.execute(
            text(
                "ALTER TABLE evaluations "
                "ADD COLUMN user_id INTEGER REFERENCES users(id)"
            )
        )
        connection.commit()
        print("Added user_id column to evaluations table.")
    else:
        print("user_id column already exists.")

    if "guest_id" not in column_names:
        connection.execute(
            text(
                "ALTER TABLE evaluations "
                "ADD COLUMN guest_id VARCHAR"
            )
        )
        connection.commit()
        print("Added guest_id column to evaluations table.")
    else:
        print("guest_id column already exists.")

print("Database migration completed successfully.")