"""
Functions and classes
"""
from sqlalchemy import text
import pandas as pd
from typing import List
import json

def query(message: str, db, return_type="records") -> List:
    """
    runs raw sql command and returns data as pandas dataframe

    message: sql query as raw string
    db: must have .session.execute method
    
    """
    db_response = db.session.execute(text(message))
    rows = db_response.fetchall()
    data = pd.DataFrame(rows, columns = list(db_response.keys()))
    if return_type == "records":
      data = data.to_json(orient="records")
      data = json.loads(data)
    return data 