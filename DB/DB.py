import json
import urllib
from functools import reduce
from os import path, getcwd

import pymongo
from console_progressbar import ProgressBar


class DB:
    def __init__(self):
        ''' initialization '''
        cred = json.load(open(path.join(getcwd().replace('DB', '').replace('datasources', '').replace('analytics', '')
                                        , 'credentials.json')))['db_pass']
        self.myclient = pymongo.MongoClient(
            'mongodb://%s:%s@188.120.231.51' % (urllib.parse.quote_plus('app'),
                                                urllib.parse.quote_plus(cred)))
        self.mydb = self.myclient['MMM']
        self.posts_collection = self.mydb['Vk_posts']
        self.news_collection = self.mydb['News']
        self.comments_collection = self.mydb['Comments']
        self.cache_collection = self.mydb['Cache']
        self.twits_collection = self.mydb['Twits']
        self.vk_users_collection = self.mydb['Vk_users']

    def add_posts(self, mylist):
        return self.posts_collection.insert_many(mylist).inserted_ids

    def get_posts(self, query=None):
        return list(self.posts_collection.find({} if query is None else {'query': query}))

    def search_posts(self, query):
        return list(self.posts_collection.find(query))

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

    def aggregate_posts_sa(self, start, end, age_request=None, sex_request=None):
        if sex_request is None:
            sex_request = [0, 1, 2, 3, 4, 5, 5]
        if age_request is None:
            age_request = [0, 1, 2]

        pipeline = [
            {
                '$match': {
                    '$and': [
                                {
                                    'date': {
                                        '$gte': start
                                    }
                                },
                                {
                                    'date': {
                                        '$lte': end
                                    }
                                }
                            ] + ([] if 2 in age_request else [{'owner_id': {'$gt': 0}}])
                }
            }, {
                '$lookup': {
                    'from': 'Vk_users',
                    'localField': 'owner_id',
                    'foreignField': 'user_id',
                    'as': 'users'
                }
            }, {
                '$replaceRoot': {
                    'newRoot': {
                        '$mergeObjects': [
                            {
                                '$arrayElemAt': [
                                    '$users', 0
                                ]
                            }, '$$ROOT'
                        ]
                    }
                }
            }, {
                '$match': {
                    '$and': [
                        {
                            '$or': [
                                {
                                    'sex': {
                                        '$exists': False
                                    }
                                }, {
                                    'sex': {
                                        '$in': sex_request + [-1]
                                    }
                                }
                            ]
                        }, {
                            '$or': [
                                {
                                    'age': {
                                        '$exists': False
                                    }
                                }, {
                                    'age': {
                                        '$in': age_request + [-1]
                                    }
                                }
                            ]
                        }
                    ]
                }
            }, {
                '$group': {
                    '_id': {
                        'query': '$query',
                        'sex': '$sex',
                        'age': '$age'
                    },
                    'count': {
                        '$sum': 1
                    },
                    'polarity': {
                        '$avg': '$polarity'
                    }
                }
            }, {
                '$replaceRoot': {
                    'newRoot': {
                        '$mergeObjects': [
                            '$_id', '$$ROOT'
                        ]
                    }
                }
            }, {
                '$group': {
                    '_id': '$query',
                    'list': {
                        '$push': {
                            'age': '$age',
                            'sex': '$sex',
                            'count': '$count',
                            'polarity': '$polarity'
                        }
                    }
                }
            },
        ]
        pre = self.posts_collection.aggregate(pipeline)
        res = []
        for i in pre:
            base = reduce(lambda x, y: [x[0] + y['count'], x[1] + y['polarity']], i['list'], [0, 0])
            base[1] /= len(i['list'])
            slist = [{'id': 'Женщины', 'polarity': 0, 'value': 0},
                     {'id': 'Мужчины', 'polarity': 0, 'value': 0}]
            alist = [{'id': '0-14 лет', 'polarity': 0, 'value': 0},
                     {'id': '15-21 лет', 'polarity': 0, 'value': 0},
                     {'id': '22-35 лет', 'polarity': 0, 'value': 0},
                     {'id': '36-50 лет', 'polarity': 0, 'value': 0},
                     {'id': '50-inf лет', 'polarity': 0, 'value': 0}]

            scnt = [0, 0]
            acnt = [0, 0, 0, 0, 0]
            for j in i['list']:
                if 'sex' in j.keys() and j['sex'] != -1 and j['age'] != -1:
                    slist[j['sex']]['value'] += j['count']
                    slist[j['sex']]['polarity'] += j['polarity']
                    alist[j['age']]['value'] += j['count']
                    alist[j['age']]['polarity'] += j['polarity']
                    scnt[j['sex']] += 1
                    acnt[j['age']] += 1

            for j in range(len(scnt)):
                slist[j]['polarity'] /= max(1, scnt[j])

            for j in range(len(acnt)):
                alist[j]['polarity'] /= max(1, acnt[j])

            res.append({'name': i['_id'],
                        'count': base[0],
                        'polarity': base[1],
                        'sex': slist,
                        'age': alist})

        return res


def add_news(self, mylist):
    return self.news_collection.insert_many(mylist).inserted_ids


def get_news(self):
    return list(self.news_collection.find())


def add_comments(self, mylist):
    return self.comments_collection.insert_many(mylist).inserted_ids


def get_comments(self):
    return list(self.comments_collection.find())


def add_cache(self, query, data):
    res = {'query': query, 'result': data}
    return self.cache_collection.insert_one(res)


def get_ya_news_by_cache(self, query):
    return list(self.news_collection.find({'query': query}))


def get_vk_posts_by_cache(self, query):
    return list(self.posts_collection.find({'query': query}))


def get_cache(self, query):
    return self.cache_collection.find_one({'query': query})


def add_twits(self, mylist):
    return self.twits_collection.insert_many(mylist).inserted_ids


def add_vk_users(self, mylist):
    try:
        return self.vk_users_collection.insert_many(mylist).inserted_ids
    except:
        print('nonooo')


def add_vk_user(self, element):
    return self.vk_users_collection.insert_one(element)


def update_post(self, id, res):
    self.posts_collection.update_one({'_id': id}, {'$set': res})


def process_sentiment():
    from analytics.SentimentAnalyser import SentimentAnalyser
    from time import time

    stime = time()

    sa = SentimentAnalyser(True)
    d = DB()

    x = d.search_posts({"polarity": -2})
    res = sa.get_polarity([i['text'] for i in x])
    r = len(res)

    print("Started for", r, "posts")
    pb = ProgressBar(total=r - 1, prefix='Processed', decimals=3, length=50, fill='=', zfill='-')

    for i in range(r):
        d.update_post(x[i]['_id'], {'polarity': float(res[i])})
        pb.print_progress_bar(i)

    print("Processing finished in", time() - stime)
