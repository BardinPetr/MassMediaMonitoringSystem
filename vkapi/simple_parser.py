import options
import vk


class VKAPI():
    def __init__(self, version):
        self.version = version
        session = vk.AuthSession(app_id=options.ID, user_login=options.LOGIN,
                                 user_password=options.PASSWORD,
                                 scope='wall, fields, messages')
        self.vkapi = vk.API(session)

    def create_structure(self, wall_item):
        if 'views' not in wall_item.keys():
            wall_item['views'] = {}
            wall_item['views']['count'] = False
        return {"id": wall_item['id'], "owner_id": wall_item['owner_id'],
                "from_id": wall_item['from_id'], "views_count": wall_item['views']['count'],
                "likes_count": wall_item['likes']['count'], "comments_count": wall_item['comments']['count'],
                "reposts_count": wall_item['reposts']['count'], "text": wall_item['text']}

    def get_post(self, quest, count):
        newsfeed = self.vkapi.newsfeed.search(q=quest, count=count, filters='post ', v=self.version)
        return [(self.create_structure(newsfeed['items'][i])) for i in range(count)]
