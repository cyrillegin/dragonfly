import getpass
from models import User
from sessionManager import sessionScope


def CreateSuperuser():
    userName = raw_input("Enter a user name: ")
    password = getpass.getpass(prompt='Enter a password: ')
    passwordAgain = getpass.getpass(prompt='Enter a password: ')
    if password != passwordAgain:
        print 'passwords do not match, please try again.'
        CreateSuperuser()
        return
    with sessionScope() as session:
        try:
            newUser = User(name=userName, password=password)
            session.add(newUser)
            session.commit()
            print "User Entered"
        except Exception, e:
            print "An error occured:"
            print e


def ChangePassword():
    userName = raw_input("User name for password change: ")
    password = getpass.getpass(prompt='Enter new password: ')
    passwordAgain = getpass.getpass(prompt='Enter new password: ')
    if password != passwordAgain:
        print 'passwords do not match, please try again.'
        ChangePassword()
        return
    with sessionScope() as session:
        try:
            user = session.query(User).filter_by(name=userName)
            setattr(user, 'password', password)
            session.commit()
            print "Password changed"
        except Exception, e:
            print "An error occured:"
            print e


def GetUserList():
    userName = raw_input("User name: ")
    password = getpass.getpass(prompt='Password: ')
    with sessionScope() as session:
        try:
            user = session.query(User).filter_by(name=userName, password=password).one()
            users = session.query(User).all()
            print 'Hello, {}\n'.format(user.toDict()['name'])
            for i in users:
                print i.toDict()
        except Exception, e:
            print "Error:"
            print e


def DeleteUser():
    userName = raw_input("User name: ")
    password = getpass.getpass(prompt='Password: ')
    with sessionScope() as session:
        try:
            user = session.query(User).filter_by(name=userName, password=password).one()
            print 'Hello, {}\n'.format(user.toDict()['name'])
        except Exception, e:
            print "Error:"
            print e

        userName = raw_input("Enter user name you'd like deleted: ")
        try:
            user = session.query(User).filter_by(name=userName).one()
            session.delete(user)
        except Exception, e:
            print "Error:"
            print e

