import vk
import options

class My_class():
    def __init__(self,count,q,v):
        self.count,self.q,self.v=count,q,v

    def create_structure(self,wall_item):
        if 'views' not in wall_item.keys():
            wall_item['views'] = {}
            wall_item['views']['count'] = False
        return {"id":wall_item['id'], "owner_id":wall_item['owner_id'],"from_id":wall_item['from_id'], "views_count":wall_item['views']['count'],
                               "likes_count":wall_item['likes']['count'], "comments_count":wall_item['comments']['count'],
                              "reposts_count":wall_item['reposts']['count'],"text": wall_item['text']}

    def _a(self):
        session = vk.AuthSession(app_id=options.ID, user_login=options.LOGIN, user_password=options.PASSWORD,
                                 scope='wall, fields, messages')
        vkapi = vk.API(session)
        newsfeed = vkapi.newsfeed.search(q=self.q, count= self.count, filters='post ', v=self.v)
        return [(self.create_structure(newsfeed['items'][i])) for i in range(self.count)]

print(My_class(count=200,q="привет",v="5.92")._a())
#wall.getComments(owner_id=,post_id=,count=)
#comments = vkapi.wall.getComments(owner_id=, post_id=, count=)

