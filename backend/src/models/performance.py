"""
Table for performances
"""
from src.database import db

class Performance(db.Model):
    """
    Table for performances
    """
    __tablename__ = 'performances'
    performanceid = db.Column(db.Integer, primary_key=True, unique=True)
    phraseid = db.Column(db.Integer, nullable=False)
    userid = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    metric = db.Column(db.Float, nullable=False)

    def toDict(self):
        """
        convert to dictionary
        """
        return dict(performanceid=self.performanceid, phraseid=self.phraseid,
                    userid=self.userid, timestamp=self.timestamp, metric=self.metric)
