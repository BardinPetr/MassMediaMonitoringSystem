import datetime
import time
from math import inf

import pymorphy2
import vk

from DB.DB import DB
from analytics.FaceAnalyser import FaceAnalyser
from settings import credentials

morph = pymorphy2.MorphAnalyzer()


class VK:

    def __init__(self):
        for key in credentials['vk_keys']:
            try:
                self.session = vk.Session(access_token=key)
                self.vkapi = vk.API(self.session)
            except:
                print('Using next key')

    def get_posts(self, query):
        newsfeed = []
        print('Start parsing')
        for i in range(5):
            feed = self.vkapi.newsfeed.search(q=query, count=200, filters='post', v=5.12, offset=i * 200)
            for news in feed['items']:
                newsfeed.append({'text': news['text'],
                                 'date': news['date'],
                                 'query': query,
                                 'owner_id': news['owner_id'],
                                 'id': news['id'],
                                 'polarity': -2})
        print(len(newsfeed))
        return newsfeed

    def nickname2obj(self, nickname):
        obj = self.vkapi.utils.resolveScreenName(screen_name=nickname, v=5.12)
        return obj

    def get_users_info(self):

        get_users = DB()

        genders = {'femn': 0, 'masc': 1, 'neut': -1}

        a = get_users.get_all_posts()
        print(len(a))

        users_list = [i['owner_id'] for i in a if i['owner_id'] > 1]
        print(len(users_list))

        list_info = []

        i = 0
        while len(list_info) < len(users_list):
            list_info += self.vkapi.users.get(user_ids=users_list[len(list_info):len(users_list)], v=5.101, fields="sex, bdate, uid, photo_max_orig",
                                            lang="ru")

            print('list_info length: ', len(list_info))
            i += 1
            
        users_info = []

        for i in list_info:

            if ('bdate' in i) and ('sex' in i) and (len(i['bdate'])) > 5:
                print(i['bdate'])
                f_per = int(
                    time.mktime(datetime.datetime.strptime(i['bdate'].replace('.', '/'), "%d/%m/%Y").timetuple()))
                time_age = int((int(time.time()) - f_per) / 31536000)
                user_info = {'age': filter(lambda x: x[1][0] <= time_age <= x[1][1],
                                           enumerate([[0, 14],
                                                      [15, 21],
                                                      [22, 35],
                                                      [36, 50],
                                                      [50, inf]])).__next__()[0],
                             'sex': i['sex'] - 1,
                             'user_id': i['id']
                             }
            else:
                try:
                    face_an = FaceAnalyser()

                    age_and_sex = face_an.process(i['photo_max_orig'])
                except Exception as e:
                    print(e)
                    age_and_sex = {"sex": -1, "age": -1}

                if age_and_sex['sex'] == -1 and age_and_sex['age'] == -1:

                    # print(i['first_name'])
                    # print(type(i['first_name']))
                    # print(i['first_name'])

                    if morph.parse(i['first_name'])[0].tag.gender is not None:

                        sex = genders[morph.parse(i['first_name'])[0].tag.gender]

                    else:

                        sex = -1

                    user_info = {
                        'age': -1,
                        'sex': sex,
                        'user_id': i['id']
                    }
                else:
                    user_info = {
                        'age': age_and_sex['age'],
                        'sex': age_and_sex['sex'],
                        'user_id': i['id']
                    }
            try:
                get_users.add_vk_user(user_info)
                print("user with id:", i['id'], 'was added')
            except:
                print('User already exist')
            users_info.append(user_info)

        # return users_info
        return ''
