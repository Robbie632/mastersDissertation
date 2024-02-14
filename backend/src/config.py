
class Config:
    """
    config for app
    """
    SQLALCHEMY_DATABASE_URI = "postgresql://languageapp:password@languageapp-db:5432/languageapp"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class TestConfig:
    """
    config for app
    """
    SQLALCHEMY_DATABASE_URI = "postgresql://languageapptest:passwordtest@languageapp-db-test:5432/languageapptest"
    SQLALCHEMY_TRACK_MODIFICATIONS = False