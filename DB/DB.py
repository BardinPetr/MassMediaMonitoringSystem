import urllib

import pymongo


class DB:
    def __init__(self):
        """ initialization """
        self.myclient = pymongo.MongoClient(
            'mongodb://%s:%s@188.120.231.51' % (urllib.parse.quote_plus('app'),
                                                urllib.parse.quote_plus(
                                                    'FJWE*uTej58E&')))
        self.mydb = self.myclient["MMM"]
        self.posts_collection = self.mydb["Posts"]
        self.news_collection = self.mydb["News"]
        self.comments_collection = self.mydb["Comments"]
        self.cache_collection = self.mydb["Cache"]

    def add_posts(self, mylist):
        return self.posts_collection.insert_many(mylist).inserted_ids

    def get_posts(self):
        return list(self.posts_collection.find())

    def add_news(self, mylist):
        return self.news_collection.insert_many(mylist).inserted_ids

    def get_news(self):
        return list(self.news_collection.find())

    def add_comments(self, mylist):
        return self.comments_collection.insert_many(mylist).inserted_ids

    def get_comments(self):
        return list(self.comments_collection.find())

    def add_cache(self, query, data):
        res = {"query": query, "result": data}
        return self.cache_collection.insert_one(res)

    def get_cache(self, query):
<<<<<<< HEAD
        return self.cache_collection.find_one({"query": query})

    def get_posts_by_query(self, query):
        return list(self.posts_collection.find_all({"query": query}))
=======
        return self.cache_collection.find_one({"query": query})['result']


d = DB()
print(d.get_cache("a"))
>>>>>>> feature-server
