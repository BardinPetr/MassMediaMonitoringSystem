import base64
import urllib
from functools import reduce

import pymongo
from console_progressbar import ProgressBar

import settings


class DB:
    def __init__(self):
        """ initialization """
        self.myclient = pymongo.MongoClient(
            'mongodb://%s:%s@%s' % (urllib.parse.quote_plus('app'),
                                    urllib.parse.quote_plus(settings.credentials['db_pass']),
                                    settings.credentials['server_ip']))
        self.mydb = self.myclient['MMM']
        self.posts_collection = self.mydb['Vk_posts']
        self.news_collection = self.mydb['Yandex_News']
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

    def aggregate_news(self, start, end):
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

        return {i['_id']: i for i in self.news_collection.aggregate(pipeline)}

    def aggregate_posts_sa(self, start, end, age_request=None, sex_request=None, datasources_request=None):
        if datasources_request is None:
            datasources_request = [0, 1]
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
                            ] + ([] if 2 in sex_request else [{'owner_id': {'$gt': 0}}])
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
        news = self.aggregate_news(start, end)

        res = []
        pre = list(pre)
        for i in pre:
            base = reduce(lambda x, y: [x[0] + y['count'], x[1] + y['polarity']],
                          i['list'] if 0 in datasources_request else [], [0, 0])

            news_i = news.get(i['_id'], None)

            if (news_i is None) or (1 not in datasources_request):
                news_i = {'count': 0, 'average': 0}

            base[0] += news_i['count']
            base[1] += news_i['average']
            base[1] /= len(i['list']) + 1

            slist = [{'id': 'Женщины', 'polarity': 0, 'value': 0},
                     {'id': 'Мужчины', 'polarity': 0, 'value': 0}]
            alist = [{'id': '0-14 лет', 'polarity': 0, 'value': 0},
                     {'id': '15-21 лет', 'polarity': 0, 'value': 0},
                     {'id': '22-35 лет', 'polarity': 0, 'value': 0},
                     {'id': '36-50 лет', 'polarity': 0, 'value': 0},
                     {'id': '50-inf лет', 'polarity': 0, 'value': 0}]

            users, groups = [0, 0], [0, 0]

            if 0 in datasources_request:
                scnt = [0, 0]
                acnt = [0, 0, 0, 0, 0]
                gucnt = [0, 0]
                for j in i['list']:
                    if 'sex' in j.keys() and j['sex'] != -1 and j['age'] != -1:
                        slist[j['sex']]['value'] += j['count']
                        slist[j['sex']]['polarity'] += j['polarity']
                        alist[j['age']]['value'] += j['count']
                        alist[j['age']]['polarity'] += j['polarity']
                        scnt[j['sex']] += 1
                        acnt[j['age']] += 1
                        users[0] += j['count']
                        users[1] += j['polarity']
                        gucnt[0] += 1
                    elif 'sex' not in j.keys():
                        groups[0] += j['count']
                        groups[1] += j['polarity']
                        gucnt[1] += 1
                users[1] /= max(1, gucnt[0])
                groups[1] /= max(1, gucnt[1])

                for j in range(len(scnt)):
                    slist[j]['polarity'] /= max(1, scnt[j])

                for j in range(len(acnt)):
                    alist[j]['polarity'] /= max(1, acnt[j])

            res.append({'name': i['_id'],
                        'count': base[0],
                        'polarity': base[1],
                        'ncount': news_i['count'],
                        'npolarity': news_i['average'],
                        'gcount': groups[0],
                        'gpolarity': groups[1],
                        'ucount': users[0],
                        'upolarity': users[1],
                        'sex': slist,
                        'age': alist})
        return res

    def add_news(self, mylist):
        return self.news_collection.insert_many(mylist).inserted_ids

    def get_news(self, query=None):
        if query is None:
            query = {}
        return list(self.news_collection.find(query))

    def add_comments(self, mylist):
        return self.comments_collection.insert_many(mylist).inserted_ids

    def get_comments(self):
        return list(self.comments_collection.find())

    def get_ya_news_by_cache(self, query):
        return list(self.news_collection.find({'query': query}))

    def get_vk_posts_by_cache(self, query):
        return list(self.posts_collection.find({'query': query}))

    @staticmethod
    def serialize_query(*args):
        return base64.b64encode('#'.join(list(map(str, args))).encode('utf-8')).decode('utf-8')

    def get_cache(self, query):
        return self.cache_collection.find_one({'query': query})

    def add_cache(self, query, data):
        return self.cache_collection.insert_one({'query': query, 'result': data})

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

    def update_news(self, id, res):
        self.news_collection.update_one({'_id': id}, {'$set': res})


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
        d.update_post(x[i]['_id'], {'polarity': float(res[i]), 'query': '-'.join(x[i]['query'].lower().split())})
        pb.print_progress_bar(i)

    print("Processing finished in", time() - stime)


def process_sentiment_news():
    from analytics.SentimentAnalyser import SentimentAnalyser
    from time import time

    stime = time()

    sa = SentimentAnalyser(True)
    d = DB()

    x = d.get_news({"query": "красная-поляна"})  # "polarity": -2})
    res = sa.get_polarity([i['text'] for i in x])
    r = len(res)

    print("Started for", r, "posts")
    pb = ProgressBar(total=r - 1, prefix='Processed', decimals=3, length=100, fill='=', zfill='-')

    for i in range(r):
        d.update_news(x[i]['_id'],
                      {'polarity': float(res[i]), 'query': 'роза-хутор'})  # '-'.join(x[i]['query'].lower().split())})
        pb.print_progress_bar(i)

    print("Processing finished in", time() - stime)
