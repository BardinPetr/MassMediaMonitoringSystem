import json
from os import path, getcwd

import vk


class VK:

    def __init__(self):
        keys_list = json.load(open(path.join(getcwd().replace('datasources', ''), 'credentials.json')))
        keys_list = keys_list['vk_keys']

        for key in keys_list:
            try:
                self.session = vk.Session(access_token=key)
                self.vkapi = vk.API(self.session)
            except:
                print('Using next key')

    def get_posts(self, query):
        newsfeed = []
        print('Start parsing')
        for i in range(5):
            feed = self.vkapi.newsfeed.search(q=query, count=1, filters='post', v=5.12, offset=i * 200)
            for news in feed['items']:
                newsfeed.append({'text': news['text'],
                                 'date': news['date'],
                                 'query': query,
                                 'owner_id': news['owner_id'],
                                 'id': news['id'],
                                 'polarity': -2})
        return newsfeed

    def nickname2obj(self, nickname):
        obj = self.vkapi.utils.resolveScreenName(screen_name=nickname, v=5.12)
        return obj

    def get_profile_info(self, id):
        profile_info = self.vkapi.utils.resolveScreenName(id, v=5.12,
                                                          fields='sex, bdate, photo, photo_medium, photo_big')
        return profile_info
