import json
from datetime import datetime
from os import path, getcwd

import tweepy


class Twitter:

    def __init__(self):
        a = json.load(open(path.join(getcwd().replace('datasources', ''), 'credentials.json')))
        auth = tweepy.OAuthHandler(a['t_key'], a['t_skey'])
        auth.set_access_token(a['t_atoken'], a['t_satoken'])
        self.api = tweepy.API(auth)

    @staticmethod
    def process(x, query):
        date = int(datetime.strptime(x['created_at'], '%a %b %m %H:%M:%S %z %Y').timestamp())
        return {
            'id': x['id'],
            'owner_id': x['user']['id'],
            "text": x['text'],
            'polarity': -2,
            'date': date,
            'query': query
        }

    def get_posts(self, query, count=100):
        return list(map(lambda x: Twitter.process(x._json, query),
                        self.api.search(query, count=count)))
