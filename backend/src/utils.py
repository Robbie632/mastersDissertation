"""
Functions and classes
"""
from sqlalchemy import text
from typing import List
import json

def query(message: str, db) -> List:
    """
    runs raw sql command and returns data as json

    message: sql query as raw string
    db: must have .session.execute method
    
    """
    db_response = db.session.execute(text(message))
    rows = db_response.fetchall()
    columns = list(db_response.keys())

    formatted_data = []
    for row in rows:
        formatted_data.append({column: value for value, column in zip(row, columns)})
    return formatted_data