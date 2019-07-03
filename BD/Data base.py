import pymongo


class DB:
    def __init__(self):
        """ initialization """
        self.myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        self.mydb = self.myclient["mydatabase"]
        self.posts_collection = self.mydb["Posts"]

    def add_posts(self, mylist):
        return self.posts_collection.insert_many(mylist).inserted_ids

    def get_posts(self):
        return list(self.posts_collection.find())
