import json
import time
from os import path, getcwd

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
    def process(x):
        return x

    def get_posts(self, query, count=200):
        return list(map(Twitter.process,
                        self.api.search(query, count=count)))
