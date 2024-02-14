"""
Table for languages
"""
from src.database import db


class Language(db.Model):
    """
Table for languages
"""
    __tablename__ = 'languages'
    languageid = db.Column(db.Integer, primary_key=True, unique=True)
    name = db.Column(db.String, unique=True, nullable=False)

    def toDict(self):
        """
        convert to dictionary
        """
        return dict(languageid=self.languageid, name=self.name)
