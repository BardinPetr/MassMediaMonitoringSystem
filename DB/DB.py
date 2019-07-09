import urllib

import pymongo


class DB:
    def __init__(self):
        """ initialization """
        self.myclient = pymongo.MongoClient(
            'mongodb://%s:%s@188.120.231.51' % (urllib.parse.quote_plus('app'),
                                                urllib.parse.quote_plus('FJWE*uTej58E&')))
        # self.myclient = pymongo.MongoClient("mongodb://localhost:27017/")

        self.mydb = self.myclient["MMM"]
        self.posts_collection = self.mydb["Posts"]
        self.news_collection = self.mydb["News"]
        self.comments_collection = self.mydb["Comments"]
        self.cache_collection = self.mydb["Cache"]

    def add_posts(self, mylist):
        return self.posts_collection.insert_many(mylist).inserted_ids

    def get_posts(self, query=None):
        return list(self.posts_collection.find({} if query is None else {"query": query}))

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

    def get_ya_news_by_cache(self, query):
        return list(self.news_collection.find({"query": query}))

    def get_vk_posts_by_cache(self, query):
        return list(self.posts_collection.find({"query": query}))

    def get_cache(self, query):
        return list(self.cache_collection.find({"query": query}))
