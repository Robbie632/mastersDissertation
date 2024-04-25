"""
Table for phrases
"""
from src.database import db


class Phrase(db.Model):
    """
    Table for phrases
    """
    __tablename__ = 'phrases'
    phraseid = db.Column(db.Integer, primary_key=True, unique=True)
    userid = db.Column(db.String, nullable=False)
    languageid = db.Column(db.Integer, nullable=False)
    l1 = db.Column(db.String, nullable=False)
    l2 = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)

    def toDict(self):
        """
        convert to dictionary
        """
        return dict(phraseid=self.phraseid, userid=self.userid, 
                    languageid=self.languageid, l1=self.l1, l2=self.l2, category=self.category)
