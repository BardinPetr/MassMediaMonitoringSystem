import vk
from datetime import datetime
import time
class GetPosts:

    def get_thousend_posts(self,query):
        session = vk.Session(access_token='c47c0269c47c0269c47c0269f2c41791c4cc47cc47c026999589348acc69844875e4dad')
        vkapi = vk.API(session)
        newsfeed = []
        for i in range(5):
            feed = vkapi.newsfeed.search(q=query, count=150, filters='post', v=5.12, offset=i*200)
            for news in feed['items']:
                newsfeed.append({'text':news['text'], 'date':news['date'],'query':query})
        
        epoch = newsfeed[0]['date']-newsfeed[-1]['date']

        return [newsfeed,epoch]
