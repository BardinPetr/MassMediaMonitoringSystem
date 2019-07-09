import vk

class VKAPI:
    def __init__(self, version="9.52"):
        session = vk.Session(access_token='c47c0269c47c0269c47c0269f2c41791c4cc47cc47c026999589348acc69844875e4dad'))
        self.vkapi = vk.API(session)

    @staticmethod
    def create_structure(wall_item, request):
        if 'views' not in wall_item.keys():
            wall_item['views'] = {}
            wall_item['views']['count'] = 0
        post_news = {"query": request,
                     "id": wall_item['id'],
                     "owner_id": wall_item['owner_id'],
                     "text": wall_item['text']}
        return post_news

    def get_post(self, quest, count):
        newsfeed = self.vkapi.newsfeed.search(q=quest, count=count, filters='post', v=self.version)
        list_news = [self.create_structure(newsfeed['items'][i], quest) for i in range(count)]
        return list_news
