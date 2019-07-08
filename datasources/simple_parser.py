import time

import vk

import datasources.options


class VKAPI:
    def __init__(self, version="9.52"):
        self.version = version
        session = vk.AuthSession(app_id=datasources.options.ID, user_login=datasources.options.LOGIN,
                                 user_password=datasources.options.PASSWORD,
                                 scope='wall, fields, messages')
        self.vkapi = vk.API(session)

    def create_structure(self, wall_item,quest):
        if 'views' not in wall_item.keys():
            wall_item['views'] = {}
            wall_item['views']['count'] = 0
        post_news = {"quest":quest,"id": wall_item['id'],
                     "owner_id": wall_item['owner_id'],
                     "from_id": wall_item['from_id'],
                     "views_count": wall_item['views']['count'],
                     "likes_count": wall_item['likes']['count'],
                     "comments_count": wall_item['comments']['count'],
                     "reposts_count": wall_item['reposts']['count'],
                     "text": wall_item['text']}
        comments = self.get_comments(wall_item['owner_id'],
                                     wall_item['id'],
                                     wall_item['comments']['count'])
        return [post_news, comments]

    def get_post(self, quest, count):
        newsfeed = self.vkapi.newsfeed.search(q=quest, count=count, filters='post ', v=self.version)
        list_news = [(self.create_structure(newsfeed['items'][i],quest)) for i in range(count)]
        return list_news

    def get_comments(self, owner_id, post_id, count):
        error = lambda: [{"text": "0"}]
        if count != 0:
            time.sleep(0.4)
            k = self.vkapi.wall.getComments(owner_id=owner_id, post_id=post_id, count=count, sort='desc', offset=0,
                                            v=self.version)["items"]
            try:
                a = []
                for i in range(count):
                    if k[i]["text"] != '':
                        a.append({"text": k[i]["text"], "owner_id": owner_id, "post_id": post_id, "number": i})
                    else:
                        return error()
                return a
            except:
                return error()
        else:
            return error()
