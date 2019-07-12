import json
import time
from os import path, getcwd
from datetime import datetime


import tweepy


class Twitter:

    def __init__(self):
        a = json.load(
            open(path.join(
                getcwd().replace('datasources', ''),
                'credentials.json')))
        auth = tweepy.OAuthHandler(a['t_key'], a['t_skey'])
        auth.set_access_token(a['t_atoken'], a['t_satoken'])
        self.api = tweepy.API(auth)

    @staticmethod
    def limit_handled(cursor):
        while True:
            try:
                yield cursor.next()
            except tweepy.RateLimitError:
                time.sleep(15 * 60)

    @staticmethod
    def process(x, query):
        x = x._json
        date = int(datetime.strptime(x['created_at'], '%a %b %m %H:%M:%S %z %Y').timestamp())
        polarity = -2
        id = x['id']
        owner_id = x['entities']['media'][0]['source_user_id']
        text = x['text']
        x = {
        'id': id, 
        'owner_id': owner_id, 
        "text": text,
        'polarity': polarity,
        'date':date,
        'query': query}

        return x

    def get_posts(self, query, count=100):
        return list(map(lambda x: Twitter.process(x, query),
                        self.api.search(query, count=count)))
