import json
import re

import vk_api
from vk_api.longpoll import VkLongPoll, VkEventType
from vk_api.utils import get_random_id

from analytics.SentimentAnalyser import SentimentAnalyser
from settings import credentials


class Bot:
    base_reply = \
        """
        Тональность определяется от 0% (плохо) до 100% (хорошо)
        Результат для вашего запроса - {}%
        """
    help_reply = \
        """
        Вы можете помочь нам, отправив сообщение с тональностью, которую вы считаете правильным
        """
    start_msg = \
        """
        Это бот для тестирования системы тонального анализа, используемого на нашем сайте. 
        Отправьте любой текст, чтобы бот определил его тональность
        """

    def __init__(self):
        self.use_digital_responces = False
        self.session = vk_api.VkApi(token=credentials['vk_bot_key'])
        self.vk = self.session.get_api()
        self.longpoll = VkLongPoll(self.session)
        self.ta = SentimentAnalyser(True)
        self.history = {}

    def pool(self):
        for event in self.longpoll.listen():
            if event.type == VkEventType.MESSAGE_NEW:
                if event.to_me:
                    request = event.text.strip()

                    print(event.user_id, ":", ' '.join([str(x) for x in re.split('[^A-zА-я0-9]', request) if x != '']))

                    hist = self.history.get(event.user_id, None)

                    try:
                        if json.loads(event.payload).get('command', None) == 'start':
                            self.write_msg(event.user_id, self.start_msg)
                            continue
                    except:
                        pass

                    if not request:
                        self.write_msg(event.user_id, "Простите, но вы ничего не написали")
                    elif request.isdecimal() and hist is not None and self.use_digital_responces:
                        val = int(request)
                        if val < 0 or val > 100:
                            self.write_msg(event.user_id, "Входные данные некорректны")
                        else:
                            txt = ' '.join([str(x) for x in re.split('[^A-zА-я0-9]', hist) if x != ''])
                            if txt and not txt.isdecimal():
                                with open('bot_results.csv', 'a') as o:
                                    o.write("{},{}\n".format(txt, val / 100.0))
                            self.write_msg(event.user_id, "Спасибо, ваш ответ учтен.")
                            del self.history[event.user_id]
                    else:
                        res = self.ta.get_polarity(request)
                        stid = filter(lambda x: x[1][0] <= res < x[1][1],
                                      enumerate([[0, 0.2], [0.2, 0.4], [0.4, 0.6], [0.6, 0.8], [0.8, 1]])).__next__()[0]
                        sticker = [9027, 9020, 9034, 9008, 9009][stid]

                        self.history[event.user_id] = request
                        self.write_msg(event.user_id,
                                       self.base_reply.strip().format(round(res * 100, 2)))
                        self.write_sticker(event.user_id, sticker)
                        if self.use_digital_responces:
                            self.write_msg(event.user_id,
                                           self.help_reply.strip())

    def write_msg(self, user_id, message):
        self.vk.messages.send(
            random_id=get_random_id(),
            user_id=user_id,
            message=message,
        )

    def write_sticker(self, user_id, id):
        self.vk.messages.send(
            random_id=get_random_id(),
            user_id=user_id,
            sticker_id=id
        )


if __name__ == '__main__':
    b = Bot()
    b.pool()
