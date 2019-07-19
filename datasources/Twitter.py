from datetime import datetime

import tweepy

from settings import credentials


class Twitter:

    def __init__(self):
        auth = tweepy.OAuthHandler(credentials['t_key'], credentials['t_skey'])
        auth.set_access_token(credentials['t_atoken'], credentials['t_satoken'])
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
