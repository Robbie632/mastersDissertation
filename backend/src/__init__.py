from flask import Flask, jsonify, request
from src.config import Config, TestConfig
from src.database import db
from src.models.phrase import Phrase
from src.models.language import Language
from src.models.rating import Rating
from src.models.phraseselection import PhraseSelection
from flask_cors import CORS
from functools import wraps
import firebase_admin
import pyrebase
import json
from firebase_admin import credentials, auth
from dotenv import load_dotenv
import requests as r

load_dotenv()


def create_app(test=False):
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
                         r"/api/token": {"origins": "*"}})

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
    def user_delete():
        response = {"status":""}
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
            else:
                jwt = "testtoken"

            response['token'] = jwt
            response["status"] = "successfully retieved JWT"
            status_code = 200
            return jsonify(response), status_code
        except Exception as e:
            response["status"] = f"could not retrieve jwt: {e}"
            status_code = 400

            return jsonify(response), status_code
        
    @app.route('/api/phrases', methods=["GET"])
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

    @app.route('/api/phrase', methods=["POST"])
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
    def ratings_get():
        status_code = 200
        data = {"status": "success", "data": 0}
        try:
            phrase_id = request.args["phraseid"]
        except KeyError as e:
            status_code = 400
            data["status"] = f"did not get expected arg: {e}"
            return jsonify(data), status_code
        try:
            db_response = Rating.query.filter_by(phraseid=phrase_id).all()
            dicts = [c.toDict() for c in db_response]
            data["data"] = dicts
            data["status_code"] = status_code
        except Exception as e:
            status_code = 400
            data["status"] = f"error: {e}"
            data["status_code"] = status_code

        return jsonify(data), status_code

    @app.route('/api/phraseselection', methods=["GET"])
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
            db_response = Phrase.query.filter_by(userid=user_id)\
                .join(PhraseSelection, Phrase.phraseid == PhraseSelection.phraseid)\
                .filter(Phrase.languageid==language_id)\
                .filter(Phrase.category==category).all()

            dicts = [c.toDict() for c in db_response]
            data["data"] = dicts
            data["status_code"] = status_code
        except Exception as e:
            status_code = 400
            data["status"] = f"error: {e}"
            data["status_code"] = status_code

        return jsonify(data), status_code

    @app.route('/api/phraseselection', methods=["POST"])
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
    def phraseselection_delete():
        response = {"status":""}
        status_code = 200
        data = request.json
        phraseselectionid = data.get('phraseselectionid')

        if phraseselectionid is None:
            status_code = 400
            response["status"] = 'Error missing phraseselectionid'
            return jsonify(response), status_code
        try:

            PhraseSelection.query.filter_by(phraseselectionid=phraseselectionid).delete()
            db.session.commit()
            response['status'] = f'Successfully deleted phraselection {phraseselectionid}'
            
            return jsonify(response), status_code
        except Exception as e:
            response["status"] = f'Error deleting phraseselection: {e}'
            return jsonify(response), 500


    return app
