from sqlalchemy import create_engine
from sqlalchemy.engine.url import URL
from sqlalchemy.engine import reflection
from sqlalchemy.schema import (
    MetaData,
    Table,
    DropTable,
    ForeignKeyConstraint,
    DropConstraint,
)
import logging
import sys

from config import PGHOST, PGPORT, PGUSERNAME, PGPASSWORD, DBNAME
import models

logging.basicConfig(format='%(levelname)s:%(asctime)s %(message)s', level=logging.INFO)


def rebuild():
    logging.info("Rebuilding db")
    # Get a connection to the postgres db
    dboptions = {}
    dboptions['drivername'] = 'postgres'
    dboptions['host'] = PGHOST
    dboptions['port'] = PGPORT
    dboptions['username'] = PGUSERNAME
    dboptions['password'] = PGPASSWORD
    dboptions['database'] = DBNAME
    print(dboptions)
    dbURL = URL(**dboptions)
    engine = create_engine(dbURL)

    logging.info("Dropping all tables from " + str(dbURL) + " ...")

    conn = engine.connect()
    trans = conn.begin()
    inspector = reflection.Inspector.from_engine(engine)
    metadata = MetaData()

    tbs = []
    all_fks = []

    for table_name in inspector.get_table_names():
        fks = []
        for fk in inspector.get_foreign_keys(table_name):
            if not fk['name']:
                continue
            fks.append(
                ForeignKeyConstraint((), (), name=fk['name'])
            )
        t = Table(table_name, metadata, *fks)
        tbs.append(t)
        all_fks.extend(fks)

    for fkc in all_fks:
        conn.execute(DropConstraint(fkc))

    for table in tbs:
        conn.execute(DropTable(table))

    trans.commit()
    logging.info("Done dropping tables for " + str(dbURL))

    setup()


def setup():
    logging.info("Setting up db.")
    dboptions = {}
    dboptions['drivername'] = 'postgres'
    dboptions['host'] = PGHOST
    dboptions['port'] = PGPORT
    dboptions['username'] = PGUSERNAME
    dboptions['password'] = PGPASSWORD
    dboptions['database'] = DBNAME
    dbURL = URL(**dboptions)

    db = create_engine(dbURL)

    logging.info("Initializing database tables.")
    models.Base.metadata.create_all(db)

    logging.info("Done setting up.")


if __name__ == "__main__":
    args = sys.argv
    if len(args) > 1:
        if args[1] == "rebuild":
            rebuild()
    else:
        print("Need arguments.")
