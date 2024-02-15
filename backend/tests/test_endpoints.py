import unittest
from src import create_app
from src.database import db
from src.models.phrase import Phrase
from src.models.language import Language
from src.models.rating import Rating
from src.models.phraseselection import PhraseSelection
from dotenv import load_dotenv
import os

load_dotenv()


class TestGetEndpoints(unittest.TestCase):
    """
    test GET endpoints
    """
    @classmethod
    def setUpClass(cls):
        """
        make app test client
        """
        cls.app = create_app(test=True)

        cls.test_client = cls.app.test_client()

        test_credentials = {"email": os.environ.get(
            "ACCOUNT_EMAIL"), "password": os.environ.get("ACCOUNT_PASSWORD")}

        response = cls.test_client.post(
            "/api/token", json=test_credentials, content_type='application/json')
        cls.jwt = response.json["token"]

    def setUp(self):
        """
        make app test client
        """
        with self.app.app_context():
            db.drop_all()
            db.create_all()
        self.test_client = self.app.test_client()

    def test_user_post(self):
        """
        test POST for user, i.e signing up
        """
        mock_data_1 = {"email": "testemail@hotmail.co.uk",
                       "password": "testpassword123!"}

        response = self.test_client.post(
            "/api/user", json=mock_data_1, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.json.get("id"))
        self.assertIsNotNone(response.json.get("id"))

    def test_user_post_400(self):
        """
        test POST for user return 400, i.e signing up
        """
        mock_data_1 = {"badkey": "testemail@hotmail.co.uk",
                       "password": "testpassword123!"}

        response = self.test_client.post(
            "/api/user", json=mock_data_1, content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_user_delete(self):
        """
        test DELETE for user, should delete relevant phraseselection data and user data
        """
        mock_data_user = {"userid": 1}

        mock_phrases = [{"languageid": 2,
                             "userid": mock_data_user["userid"],
                             "l1": "l1 phrase 1",
                             "l2": "l2 phrase 1",
                             "category": "cafe"},
                            {"languageid": 2,
                             "userid": 2,
                             "l1": "l1 phrase 2",
                             "l2": "l2 phrase 2",
                             "category": "cafe"}]

        mock_phraseselections = [{"userid": mock_data_user["userid"], "phraseid": 1},
                                      {"userid": mock_data_user["userid"], "phraseid": 2},
                                      {"userid": 2, "phraseid": 2},]
        with self.app.app_context():
            for phrase in mock_phrases:         
                db.session.add(Phrase(languageid=phrase["languageid"],
                                      userid=phrase["userid"],
                                      l1=phrase["l1"],
                                      l2=phrase["l2"],
                                      category=phrase["category"]))
                db.session.commit()
            for phraseselection in mock_phraseselections:
                db.session.add(PhraseSelection(userid=phraseselection["userid"],
                                phraseid=phraseselection["phraseid"]))
                db.session.commit()

        response = self.test_client.delete(
            "/api/user", json=mock_data_user, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        with self.app.app_context():
            observed_phraseselections = PhraseSelection.query.all()
            observed_phrases = Phrase.query.all()
        for observed_phraseselection in observed_phraseselections:
            self.assertEqual(2, int(observed_phraseselection.userid))
            
        # TODO check no phraseselection exist with userid = 1 but still exists for userid=2
        # TODO check phrases associated with user1 still exist
        
    def test_phrases_get(self):
        """
        test GET for phrases
        """
        mock_data_1 = {"languageid": 1, "userid": 1,
                       "l1": "l1 phrase 1", "l2": "l2 phrase 1", "category": "restaurant"}
        mock_data_2 = {"languageid": 2, "userid": 1,
                       "l1": "l1 phrase 2", "l2": "l2 phrase 2", "category": "cafe"}
        with self.app.app_context():
            db.session.add(Phrase(languageid=mock_data_1["languageid"],
                                  userid=mock_data_1["userid"],
                                  l1=mock_data_1["l1"],
                                  l2=mock_data_1["l2"],
                                  category=mock_data_1["category"]))
            db.session.commit()
            db.session.add(Phrase(languageid=mock_data_2["languageid"],
                                  userid=mock_data_2["userid"],
                                  l1=mock_data_2["l1"],
                                  l2=mock_data_2["l2"],
                                  category=mock_data_2["category"]))
            db.session.commit()

        response = self.test_client.get(
            "/api/phrases", headers={"authorization": self.jwt})
        self.assertEqual(response.status_code, 200)
        observed_data = response.json["data"]
        self.assertEqual(2, len(observed_data))
        observed_data_1 = [
            c for c in observed_data if c["languageid"] == mock_data_1["languageid"]]
        observed_data_2 = [
            c for c in observed_data if c["languageid"] == mock_data_2["languageid"]]

        for (observed, expected, test_name) in [(observed_data_1, mock_data_1, "mock_data_1"), (observed_data_2, mock_data_2, "mock_data_2")]:
            with self.subTest(test_name):
                self.assertEqual(
                    observed[0]["languageid"], expected["languageid"])
                self.assertEqual(observed[0]["userid"], expected["userid"])
                self.assertEqual(observed[0]["l1"], expected["l1"])
                self.assertEqual(observed[0]["l2"], expected["l2"])
                self.assertEqual(observed[0]["category"], expected["category"])

    def test_languages_get(self):
        """
        test GET for languages
        """
        mock_data_1 = {"name": "swedish"}
        mock_data_2 = {"name": "spanish"}
        with self.app.app_context():
            db.session.add(Language(name=mock_data_1["name"]))
            db.session.commit()
            db.session.add(Language(name=mock_data_2["name"]))
            db.session.commit()

        response = self.test_client.get(
            "/api/languages", headers={"authorization": self.jwt})
        self.assertEqual(response.status_code, 200)
        observed_data = response.json["data"]
        self.assertEqual(2, len(observed_data))
        observed_names = set([c["name"] for c in observed_data])
        expected_names = set([mock_data_1["name"], mock_data_2["name"]])
        self.assertEqual(observed_names, expected_names)

    def test_langauge_post(self):
        """
        test addition of new language
        """
        mock_data = {"name": "Swedish"}
        response = self.test_client.post(
            "/api/language", json=mock_data, content_type='application/json', headers={"authorization": self.jwt})
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.json.get("id"))
        with self.app.app_context():
            observed = Language.query.all()
        self.assertEqual(1, len(observed))
        first_observed = observed[0]
        self.assertEqual(mock_data["name"].lower(), first_observed.name)

    def test_langauge_post_400(self):
        """
        test addition of new language and get 400 back
        """
        mock_data = {"badkey": "Swedish"}
        response = self.test_client.post(
            "/api/language", json=mock_data, content_type='application/json', headers={"authorization": self.jwt})
        self.assertEqual(response.status_code, 400)

    def test_phrase_post(self):
        """
        test post where write phrase data
        """
        mock_data = {"languageid": 1, "userid": 1,
                     "l1": "l1 phrase", "l2": "l2 phrase", "category": "cafe"}
        response = self.test_client.post(
            "/api/phrase", json=mock_data, content_type='application/json', headers={"authorization": self.jwt})
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.json.get("id"))
        with self.app.app_context():
            observed = Phrase.query.all()
        self.assertEqual(1, len(observed))
        first_observed = observed[0]
        self.assertEqual(mock_data["languageid"],
                         int(first_observed.languageid))
        self.assertEqual(mock_data["userid"], int(first_observed.userid))
        self.assertEqual(mock_data["l1"], first_observed.l1)
        self.assertEqual(mock_data["l2"], first_observed.l2)
        self.assertEqual(mock_data["category"], first_observed.category)

    def test_phrase_post_400(self):
        """
        test post where write phrase data and get 400 status code back
        """
        mock_data = {"l1": "l1 phrase", "l2": "l2 phrase", "category": "cafe"}
        response = self.test_client.post(
            "/api/phrase", json=mock_data, content_type='application/json', headers={"authorization": self.jwt})
        self.assertEqual(response.status_code, 400)

    def test_rating_get(self):
        """
        test get ratings for specific phraseid
        """
        mock_data_1 = {"ratingid": 1, "phraseid": 1, "userid": 1, "rating": 3}
        mock_data_2 = {"ratingid": 2, "phraseid": 2, "userid": 1, "rating": 3}

        with self.app.app_context():
            db.session.add(Rating(ratingid=mock_data_1["ratingid"],
                                  phraseid=mock_data_1["phraseid"],
                                  userid=mock_data_1["userid"],
                                  rating=mock_data_1["rating"]))
            db.session.commit()
            db.session.add(Rating(ratingid=mock_data_2["ratingid"],
                                  phraseid=mock_data_2["phraseid"],
                                  userid=mock_data_2["userid"],
                                  rating=mock_data_2["rating"]))
            db.session.commit()

        response = self.test_client.get(
            f"/api/rating?phraseid={mock_data_1['phraseid']}", headers={"authorization": self.jwt})
        self.assertEqual(response.status_code, 200)
        observed_data = response.json["data"]
        self.assertEqual(1, len(observed_data))
        observed_data = observed_data[0]
        self.assertEqual(mock_data_1["ratingid"],
                         int(observed_data["ratingid"]))
        self.assertEqual(mock_data_1["phraseid"],
                         int(observed_data["phraseid"]))
        self.assertEqual(mock_data_1["userid"], int(observed_data["userid"]))
        self.assertEqual(mock_data_1["rating"], int(observed_data["rating"]))

    def test_rating_post(self):
        """
        test post rating for specific phraseid
        """
        mock_data = {"phraseid": 1, "userid": 1,
                     "rating": 4}
        response = self.test_client.post(
            "/api/rating", json=mock_data, content_type='application/json', headers={"authorization": self.jwt})
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.json.get("id"))
        with self.app.app_context():
            observed = Rating.query.all()
        self.assertEqual(1, len(observed))
        first_observed = observed[0]
        self.assertEqual(mock_data["phraseid"],
                         int(first_observed.phraseid))
        self.assertEqual(mock_data["userid"], int(first_observed.userid))
        self.assertEqual(mock_data["rating"], int(first_observed.rating))

    def test_rating_post_400(self):
        """
        test post where write rating data and get 400 status code back
        """
        mock_data = {"userid": 1, "rating": 4}
        response = self.test_client.post(
            "/api/rating", json=mock_data, content_type='application/json', headers={"authorization": self.jwt})
        self.assertEqual(response.status_code, 400)

    def test_phraseselection_get(self):
        """
        test get phraseselection for specific phraseid
        """

        mock_phraseselection_data_1 = {"userid": 1, "phraseid": 1}
        mock_phraseselection_data_2 = {"userid": 2, "phraseid": 2}

        mock_phrase_data_1 = {"languageid": 1, "userid": 1,
                              "l1": "l1 phrase", "l2": "l2 phrase", "category": "cafe"}
        mock_phrase_data_2 = {"languageid": 2, "userid": 1,
                              "l1": "l1 phrase", "l2": "l2 phrase", "category": "cafe"}

        mock_language_data_1 = {"name": "Swedish"}
        mock_language_data_2 = {"name": "Spanish"}

        with self.app.app_context():
            db.session.add(PhraseSelection(userid=mock_phraseselection_data_1["userid"],
                                           phraseid=mock_phraseselection_data_1["phraseid"]))
            db.session.commit()
            db.session.add(PhraseSelection(userid=mock_phraseselection_data_2["userid"],
                                           phraseid=mock_phraseselection_data_2["phraseid"]))
            db.session.commit()
            db.session.add(Phrase(languageid=mock_phrase_data_1["languageid"],
                                  userid=mock_phrase_data_1["userid"],
                                  l1=mock_phrase_data_1["l1"],
                                  l2=mock_phrase_data_1["l2"],
                                  category=mock_phrase_data_1["category"]))
            db.session.commit()
            db.session.add(Phrase(languageid=mock_phrase_data_2["languageid"],
                                  userid=mock_phrase_data_2["userid"],
                                  l1=mock_phrase_data_2["l1"],
                                  l2=mock_phrase_data_2["l2"],
                                  category=mock_phrase_data_2["category"]))
            db.session.commit()
            db.session.add(Language(name=mock_language_data_1["name"]))
            db.session.commit()
            db.session.add(Language(name=mock_language_data_2["name"]))
            db.session.commit()

        response = self.test_client.get(
            f"/api/phraseselection?userid={mock_phraseselection_data_1['userid']}&languageid={1}", headers={"authorization": self.jwt})
        self.assertEqual(response.status_code, 200)
        observed_data = response.json["data"]
        self.assertEqual(1, len(observed_data))
        observed_data = observed_data[0]
        self.assertEqual(mock_phraseselection_data_1["phraseid"],
                         int(observed_data["phraseid"]))
        self.assertEqual(mock_phraseselection_data_1["userid"], int(
            observed_data["userid"]))

    def test_phraseselection_get_400(self):
        """
        test get phraseselection for specific phraseid when use bad arg name
        """
        mock_data_1 = {"userid": 1, "phraseid": 1}

        response = self.test_client.get(
            f"/api/phraseselection?badargname={mock_data_1['userid']}", headers={"authorization": self.jwt})
        self.assertEqual(response.status_code, 400)

    def test_phraseselection_post(self):
        """
        test post phraseselection
        """
        mock_data = {"phraseid": 1, "userid": 1}
        response = self.test_client.post(
            "/api/phraseselection", json=mock_data, content_type='application/json', headers={"authorization": self.jwt})
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.json.get("id"))
        with self.app.app_context():
            observed = PhraseSelection.query.all()
        self.assertEqual(1, len(observed))
        first_observed = observed[0]
        self.assertEqual(mock_data["phraseid"],
                         int(first_observed.phraseid))
        self.assertEqual(mock_data["userid"], int(first_observed.userid))

    def test_phraseselection_post_400(self):
        """
        test post where write phraseselection data and get 400 status code back
        """
        mock_data = {"userid": 1}
        response = self.test_client.post(
            "/api/phraseselection", json=mock_data, content_type='application/json', headers={"authorization": self.jwt})
        self.assertEqual(response.status_code, 400)


if __name__ == '__main__':
    unittest.main()
