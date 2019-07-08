import vk

import datasources.options


class VKAPI:
    def __init__(self, version="9.52"):
        self.version = version
        session = vk.AuthSession(app_id=datasources.options.ID,
                                 user_login=datasources.options.LOGIN,
                                 user_password=datasources.options.PASSWORD,
                                 scope='wall, fields, messages')
        self.vkapi = vk.API(session)

    @staticmethod
    def create_structure(wall_item, request):
        if 'views' not in wall_item.keys():
            wall_item['views'] = {}
            wall_item['views']['count'] = 0
        post_news = {"query": request,
                     "id": wall_item['id'],
                     "owner_id": wall_item['owner_id'],
                     "from_id": wall_item['from_id'],
                     "views_count": wall_item['views']['count'],
                     "likes_count": wall_item['likes']['count'],
                     "comments_count": wall_item['comments']['count'],
                     "reposts_count": wall_item['reposts']['count'],
                     "text": wall_item['text']}
        return post_news

    def get_post(self, quest, count):
        newsfeed = self.vkapi.newsfeed.search(q=quest,
                                              count=count,
                                              filters='post ',
                                              v=self.version)
        list_news = [self.create_structure(newsfeed['items'][i], quest) for i in range(count)]
        return list_news
