import urllib

import pymongo


class DB:
    def __init__(self):
        """ initialization """
        self.myclient = pymongo.MongoClient(
            'mongodb://%s:%s@188.120.231.51' % (urllib.parse.quote_plus('app'),
                                                urllib.parse.quote_plus('FJWE*uTej58E&')))
        self.mydb = self.myclient["MMM"]
        self.posts_collection = self.mydb["Vk_posts"]
        self.news_collection = self.mydb["News"]
        self.comments_collection = self.mydb["Comments"]
        self.cache_collection = self.mydb["Cache"]
        self.twits_collection = self.mydb['Twits']
        self.vk_users_collection = self.mydb['Vk_users']

    def add_posts(self, mylist):
        return self.posts_collection.insert_many(mylist).inserted_ids

    def get_posts(self, query=None):
        return list(self.posts_collection.find({} if query is None else {"query": query}))

    def get_all_posts(self):
        listt = list(self.posts_collection.find())
        print('Posts collected successfully')
        return listt



    def aggregate_posts(self, start, end):
        pipeline = [
            {
                '$match': {
                    '$and': [
                        {'date': {'$gte': start}},
                        {'date': {'$lte': end}}
                    ]
                }
            },
            {
                '$group': {
                    '_id': '$query',
                    'count': {'$sum': 1},
                    'average': {'$avg': '$polarity'}
                }
            }
        ]

        return list(self
                    .posts_collection
                    .aggregate(pipeline))

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
        return self.cache_collection.find_one({"query": query})

    def add_twits(self, mylist):
        return self.twits_collection.insert_many(mylist).inserted_ids

    def add_vk_users(self, mylist):
        return self.vk_users_collection.insert_many(mylist).inserted_ids

    def add_vk_user(self, element):
        return self.vk_users_collection.insert_one(element)


    