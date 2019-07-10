import vk

class GetPosts:

    def get_thousend_posts(self,query):
        session = vk.Session(access_token='6000d53e6000d53e6000d53eba606b4de4660006000d53e3d250522668e135d58bb36b6')
        vkapi = vk.API(session)
        newsfeed = []
        print('Start parsing')
        for i in range(5):
            feed = vkapi.newsfeed.search(q=query, count=200, filters='post', v=5.12, offset=i*200)
            for news in feed['items']:
                newsfeed.append({'text':news['text'], 'date':news['date'],'query':query,'owner_id':news['owner_id'],'id':news['id'],'polarity': -2})
        print(len(newsfeed))
        
        #epoch = newsfeed[0]['date']-newsfeed[-1]['date']

        return newsfeed

