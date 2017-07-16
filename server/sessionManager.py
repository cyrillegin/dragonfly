

from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


engine = "sqlite:///dragonDB.db"


@contextmanager
def sessionScope(file=None):
    if file is None:
        file = engine
    db = create_engine(file)
    Session = sessionmaker(bind=db)
    session = Session()

    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()


def createSession(file=None):
    if file is None:
        file = engine
    db = create_engine(file)
    Session = sessionmaker(bind=db)
    session = Session()
    return session
