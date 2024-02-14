"""
Table for ratings
"""
from src.database import db

class Rating(db.Model):
    """
    Table for ratings
    """
    __tablename__ = 'ratings'
    ratingid = db.Column(db.Integer, primary_key=True, unique=True)
    phraseid = db.Column(db.Integer, nullable=False)
    userid = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer, nullable=False)

    def toDict(self):
        """
        convert to dictionary
        """
        return dict(ratingid=self.ratingid, phraseid=self.phraseid,
                    userid=self.userid, rating=self.rating)
