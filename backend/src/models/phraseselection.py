"""
Table for selection of phrases for user
"""
from src.database import db


class PhraseSelection(db.Model):
    """
    Table for phrases selections
    """
    __tablename__ = 'phraseselections'

    phraseselectionid = db.Column(db.Integer, primary_key=True, unique=True)
    phraseid = db.Column(db.Integer, nullable=False)
    userid = db.Column(db.Integer, nullable=False)

    def toDict(self):
        """
        convert to dictionary
        """
        return dict(phraseselectionid=self.phraseselectionid, 
                    phraseid=self.phraseid, userid=self.userid)
