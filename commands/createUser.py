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
