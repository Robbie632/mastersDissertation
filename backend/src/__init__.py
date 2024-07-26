from flask import Flask, jsonify, request
from src.config import Config, TestConfig
from src.database import db
from src.models.phrase import Phrase
from src.models.language import Language
from src.models.rating import Rating
from src.models.phraseselection import PhraseSelection
from src.models.performance import Performance
from src.utils import query
from flask_cors import CORS
from functools import wraps
import firebase_admin
import pyrebase
import json
from firebase_admin import credentials, auth
from dotenv import load_dotenv
from datetime import datetime
import requests


load_dotenv()


def create_app(test=False):
    
    metric_model_api = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
    # Connect to firebase
    cred = credentials.Certificate('./src/secrets/fbAdminConfig.json')
    firebase = firebase_admin.initialize_app(cred)
    pb = pyrebase.initialize_app(
        json.load(open('./src/secrets/fbConfig.json')))

    app = Flask(__name__, instance_relative_config=True)

    if not test:
        app.config.from_object(Config)
    else:
        app.config.from_object(TestConfig)

    db.init_app(app)
    with app.app_context():
        db.create_all()

    CORS(app, resources={r"/api/user": {"origins": "*"},
                         r"/api/token": {"origins": "*"},
                         r"/api/phraseselection": {"origins": "*"},
                         r"/api/phraseselection/category": {"origins": "*"},
                         r"/api/phrase": {"origins": "*"},
                         r"/api/phrases/category": {"origins": "*"},
                         r"/api/phrases/category/user": {"origins": "*"},
                         r"/api/performances": {"origins": "*"},
                         r"/api/performance": {"origins": "*"},
                         r"/api/metric": {"origins": "*"},
                         r"/api/rating": {"origins": "*"},
                         r"/api/checkjwt": {"origins": "*"}})

    def check_token(f):
        @wraps(f)
        def wrap(*args, **kwargs):
            if not request.headers.get('authorization'):
                return {'message': 'No token provided'}, 400
            try:
                if not test:
                    user = auth.verify_id_token(
                        request.headers['authorization'])
                else:
                    user = "testuser"
                request.user = user
            except:
                return {'message': 'Invalid token provided.'}, 400
            return f(*args, **kwargs)
        return wrap
    
    @app.route('/api/checkjwt', methods=["GET"])
    @check_token
    def checkjwt():
        return jsonify({}), 200

    @app.route('/api/user', methods=["POST"])
    def user_post():
        status_code = 201
        response = {
            "status": "",
            "id": ""
        }
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if email is None or password is None:
            status_code = 400
            response["status"] = "Error missing email or password"
            return jsonify(response), status_code
        try:
            if not test:
                user = auth.create_user(
                    email=email,
                    password=password
                )
                uid = user.uid
            else:
                uid = "testuserid"
            response["id"] = uid
            response["status"] = "successfully created user"
            status_code = 201
            return jsonify(response), status_code

        except Exception as e:
            status_code = 500
            response["message"] = f"Error creating user: {e}"
            return jsonify(response), status_code

    @app.route('/api/user', methods=["DELETE"])
    @check_token
    def user_delete():
        response = {"status": ""}
        status_code = 200
        data = request.json
        userid = data.get('userid')

        if userid is None:
            status_code = 400
            response["status"] = 'Error missing userid'
            return jsonify(response), status_code
        try:
            if not test:
                auth.delete_user(
                    uid=userid)
            else:
                pass
            PhraseSelection.query.filter_by(userid=userid).delete()
            db.session.commit()

            response['status'] = f'Successfully deleted user {userid}'

            return jsonify(response), status_code
        except Exception as e:
            response["status"] = f'Error deleting user: {e}'
            return jsonify(response), 500

    @app.route('/api/token', methods=["POST"])
    def token():
        status_code = 200
        response = {
            "status": "",
            "token": ""
        }
        data = request.json
        email = data.get('email')
        password = data.get('password')
        if email is None or password is None:
            status_code = 400
            response["status"] = "password and or email missing"
            return jsonify(response), status_code
        try:
            if not test:
                user = pb.auth().sign_in_with_email_and_password(email, password)
                jwt = user['idToken']
                userid = user['localId']
            else:
                jwt = "testtoken"
                userid = "testid"

            response['token'] = jwt
            response["userid"] = userid
            response["status"] = "successfully retieved JWT"
            status_code = 200
            return jsonify(response), status_code
        except Exception as e:
            response["status"] = f"could not retrieve jwt: {e}"
            status_code = 400

            return jsonify(response), status_code
    
    @app.route('/api/phrases', methods=["GET"])
    @check_token
    def phrases_get():
        status_code = 200
        data = {"status": "success", "data": 0}
        try:
            db_response = Phrase.query.all()
            dicts = [c.toDict() for c in db_response]
            data["data"] = dicts
            data["status_code"] = status_code
        except Exception as e:
            status_code = 400
            data["status"] = f"error: {e}"
            data["status_code"] = status_code

        return jsonify(data), status_code

    @app.route('/api/phrases/category', methods=["GET"])
    @check_token
    def phrasescategory_get():
        status_code = 200
        data = {"status": "success", "data": 0}
        try:
            category = request.args["category"]
        except KeyError as e:
            status_code = 400
            data["status"] = f"did not get expected arg: {e}"
            return jsonify(data), status_code

        try:
            db_response = db.session.query(Phrase).filter(
                Phrase.category == category)
            dicts = [c.toDict() for c in db_response]
            data["data"] = dicts
            data["status_code"] = status_code
        except Exception as e:
            status_code = 400
            data["status"] = f"error: {e}"
            data["status_code"] = status_code

        return jsonify(data), status_code

    @app.route('/api/phrases/category/user', methods=["GET"])
    @check_token
    def phrasescategoryuser_get():
        status_code = 200
        data = {"status": "success", "data": 0}
        try:
            category = request.args["category"]
            userid = request.args["userid"]
        except KeyError as e:
            status_code = 400
            data["status"] = f"did not get expected arg: {e}"
            return jsonify(data), status_code

        try:
            db_response = query(f"""
                SELECT phrases.phraseid, phrases.l1, phrases.l2, ROUND(AVG(ratings.rating), 0) AS average_rating
                FROM phrases 
                LEFT JOIN ratings
                ON ratings.phraseid = phrases.phraseid
                WHERE phrases.phraseid 
                NOT IN (SELECT DISTINCT(phraseid)
                        FROM phraseselections
                        WHERE userid = '{userid}')
                AND phrases.category = '{category}'
                GROUP BY phrases.phraseid
                ORDER BY AVG(ratings.rating) DESC
                """, db)

            data["data"] = db_response
            data["status_code"] = status_code
        except Exception as e:
            status_code = 400
            data["status"] = f"error: {e}"
            data["status_code"] = status_code

        return jsonify(data), status_code

    @app.route('/api/phrase', methods=["POST"])
    @check_token
    def phrase_post():
        status_code = 201
        response = {
            "status": "",
            "id": ""
        }
        try:
            data = request.json
            languageid = data["languageid"]
            userid = data["userid"]
            l1 = data["l1"]
            l2 = data["l2"]
            category = data["category"]
            try:
                phrase = Phrase(languageid=languageid,
                                userid=userid, l1=l1, l2=l2, category=category)
                db.session.add(phrase)
                db.session.commit()
                response["id"] = phrase.phraseid
            except Exception as e:
                db.session.rollback()
                status_code = 500
                response["status"] = f"problem writing new phrase to database: {str(e)}"
        except KeyError:
            status_code = 400
            response["status"] = "received unexpected data format"

        return jsonify(response), status_code

    @app.route('/api/phrase', methods=["PATCH"])
    @check_token
    def phrase_patch():
        status_code = 200
        response = {
            "status": "",
            "id": ""
        }
        try:
            data = request.json
            phraseid = data["phraseid"]
            l1 = data["l1"]
            l2 = data["l2"]

            try:
                phrase = Phrase.query.filter_by(phraseid=phraseid).first()
                phrase.l1 = l1
                phrase.l2 = l2
                db.session.commit()
                response["id"] = phrase.phraseid
            except Exception as e:
                db.session.rollback()
                status_code = 500
                response["status"] = f"problem updating phrase: {str(e)}"
        except KeyError:
            status_code = 400
            response["status"] = "received unexpected data format"

        return jsonify(response), status_code

    @app.route('/api/language', methods=["POST"])
    @check_token
    def language_post():
        status_code = 201
        response = {
            "status": "",
            "id": ""
        }
        try:
            data = request.json
            name = data["name"]
            name = name.lower()
            try:
                language = Language(name=name)
                db.session.add(language)
                db.session.commit()
                response["id"] = language.languageid
            except Exception as e:
                db.session.rollback()
                status_code = 500
                response["status"] = f"problem writing new language to database: {str(e)}"
        except KeyError:
            status_code = 400
            response["status"] = "received unexpected data format"

        return jsonify(response), status_code

    @app.route('/api/languages', methods=["GET"])
    @check_token
    def languages_get():
        status_code = 200
        data = {"status": "success", "data": 0}
        try:
            db_response = Language.query.all()
            dicts = [c.toDict() for c in db_response]
            data["data"] = dicts
            data["status_code"] = status_code
        except Exception as e:
            status_code = 400
            data["status"] = f"error: {e}"
            data["status_code"] = status_code

        return jsonify(data), status_code

    @app.route('/api/rating', methods=["POST"])
    @check_token
    def rating_post():
        status_code = 201
        response = {
            "status": "",
            "id": ""
        }
        try:
            data = request.json
            phraseid = data["phraseid"]
            userid = data["userid"]
            rating = data["rating"]

            try:
                rating = Rating(phraseid=phraseid,
                                userid=userid,
                                rating=rating)
                db.session.add(rating)
                db.session.commit()
                response["id"] = rating.ratingid
            except Exception as e:
                db.session.rollback()
                status_code = 500
                response["status"] = f"problem writing new rating to database: {str(e)}"
        except KeyError:
            status_code = 400
            response["status"] = "received unexpected data format"

        return jsonify(response), status_code

    @app.route('/api/rating', methods=["GET"])
    @check_token
    def ratings_get():
        status_code = 200
        data = {"status": "success", "data": 0}
        try:
            category = request.args["category"]
        except KeyError as e:
            status_code = 400
            data["status"] = f"did not get expected arg: {e}"
            return jsonify(data), status_code
        try:
            db_response = db.session.query(Rating, Phrase).join(Rating, Phrase.phraseid == Rating.phraseid)\
                            .filter(Phrase.category == category).all()
            dicts = []
            for i in db_response:
                t = i.tuple()
                rating_data = t[0].toDict()
                phrase_data = t[1].toDict()
                dicts.append(
                    {"Rating": rating_data, "Phrase": phrase_data})
            data["data"] = dicts
            data["status_code"] = status_code
        except Exception as e:
            status_code = 400
            data["status"] = f"error: {e}"
            data["status_code"] = status_code

        return jsonify(data), status_code

    @app.route('/api/phraseselection', methods=["GET"])
    @check_token
    def phraseselection_get():
        status_code = 200
        data = {"status": "success", "data": 0}
        try:
            user_id = request.args["userid"]
            language_id = request.args["languageid"]
        except KeyError as e:
            status_code = 400
            data["status"] = f"did not get expected arg: {e}"
            return jsonify(data), status_code

        try:
            db_response = PhraseSelection.query.filter_by(userid=user_id)\
                .join(Phrase, PhraseSelection.phraseid == Phrase.phraseid)\
                .filter_by(languageid=language_id).all()

            dicts = [c.toDict() for c in db_response]
            data["data"] = dicts
            data["status_code"] = status_code
        except Exception as e:
            status_code = 400
            data["status"] = f"error: {e}"
            data["status_code"] = status_code

        return jsonify(data), status_code

    @app.route('/api/phraseselection/category', methods=["GET"])
    @check_token
    def phraseselectioncategory_get():
        status_code = 200
        data = {"status": "success", "data": 0}
        try:
            user_id = request.args["userid"]
            language_id = request.args["languageid"]
            category = request.args["category"]
        except KeyError as e:
            status_code = 400
            data["status"] = f"did not get expected arg: {e}"
            return jsonify(data), status_code

        try:
            db_response = db.session.query(PhraseSelection, Phrase).join(PhraseSelection, Phrase.phraseid == PhraseSelection.phraseid)\
                            .filter(Phrase.languageid == language_id)\
                            .filter(Phrase.category == category).filter(Phrase.userid == user_id).all()
            dicts = []
            for i in db_response:
                t = i.tuple()
                phrase_selection_data = t[0].toDict()
                phrase_data = t[1].toDict()
                dicts.append(
                    {"PhraseSelection": phrase_selection_data, "Phrase": phrase_data})

            data["data"] = dicts

            data["status_code"] = status_code
        except Exception as e:
            status_code = 400
            data["status"] = f"error: {e}"
            data["status_code"] = status_code

        return jsonify(data), status_code

    @app.route('/api/phraseselection', methods=["POST"])
    @check_token
    def phraseselection_post():
        status_code = 201
        response = {
            "status": "",
            "id": ""
        }
        try:
            data = request.json
            phraseid = data["phraseid"]
            userid = data["userid"]

            try:
                phraseselection = PhraseSelection(phraseid=phraseid,
                                                  userid=userid)
                db.session.add(phraseselection)
                db.session.commit()
                response["id"] = phraseselection.phraseselectionid
            except Exception as e:
                db.session.rollback()
                status_code = 500
                response[
                    "status"] = f"problem writing new phraseselection to database: {str(e)}"
        except KeyError:
            status_code = 400
            response["status"] = "received unexpected data format"

        return jsonify(response), status_code

    @app.route('/api/phraseselection', methods=["DELETE"])
    @check_token
    def phraseselection_delete():
        response = {"status": ""}
        status_code = 200
        data = request.json
        phraseselectionid = data.get('phraseselectionid')

        if phraseselectionid is None:
            status_code = 400
            response["status"] = 'Error missing phraseselectionid'
            return jsonify(response), status_code
        try:

            PhraseSelection.query.filter_by(
                phraseselectionid=phraseselectionid).delete()
            db.session.commit()
            response['status'] = f'Successfully deleted phraselection {phraseselectionid}'

            return jsonify(response), status_code
        except Exception as e:
            response["status"] = f'Error deleting phraseselection: {e}'
            return jsonify(response), 500

    @app.route('/api/performances', methods=["GET"])
    @check_token
    def performances_get():
        status_code = 200
        data = {"status": "success", "data": 0}

        try:
            db_response = db.session.query(Performance).all()
            dicts = [c.toDict() for c in db_response]
            data["data"] = dicts
            data["status_code"] = status_code
        except Exception as e:
            status_code = 400
            data["status"] = f"error: {e}"
            data["status_code"] = status_code

        return jsonify(data), status_code

    @app.route('/api/performance', methods=["POST"])
    @check_token
    def performance_post():
        status_code = 201
        response = {
            "status": "",
            "id": ""
        }
        try:
            data = request.json
            phraseid = data["phraseid"]
            userid = data["userid"]
            timestamp = datetime.now()
            metric = data["metric"]

            try:
                performance = Performance(phraseid=phraseid,
                                          userid=userid,
                                          timestamp=timestamp,
                                          metric=metric)
                db.session.add(performance)
                db.session.commit()
                response["id"] = performance.performanceid
            except Exception as e:
                db.session.rollback()
                status_code = 500
                response[
                    "status"] = f"problem writing new performance data to database: {str(e)}"
        except KeyError:
            status_code = 400
            response["status"] = "received unexpected data format"

        return jsonify(response), status_code

    @app.route('/api/metric', methods=["POST"])
    @check_token
    def metric_post():
        status_code = 200
        response = {
            "status": "",
            "metric": ""
        }
        try:
            data = request.json
            phrasea = data["phrasea"]
            phraseb = data["phraseb"]

        except KeyError:
            status_code = 400
            response["status"] = "received unexpected data format"
        
        api_token = "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"
        headers = {"Authorization": f"Bearer {api_token}"}
        
        payload = {
            "inputs": {
                "source_sentence": phrasea,
                "sentences": [phraseb]
            }
        }
        try:
          huggingface_response = requests.post(metric_model_api, headers=headers, json=payload, timeout=5)
          response["metric"] = huggingface_response.json()
        except requests.exceptions.Timeout:
            status_code=400
            response["status"] = "api call to hugging faces model timed out"
        except requests.exceptions.RequestException:
            status_code = 400
            response["status"] = "api call to hugging faces model raised RequestException"

        return jsonify(response), status_code
    
    return app
