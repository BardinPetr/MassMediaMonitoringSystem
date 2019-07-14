import facebook
import urllib
import pymongo

class FaceBookParser(object):
    def get_posts(self):
        graph = facebook.GraphAPI(access_token="your_token", version="2.12")
        pass

if __name__ == '__main__':
    f = FaceBookParser()
    f.get_posts()