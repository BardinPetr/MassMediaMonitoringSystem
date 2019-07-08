import pymorphy2
from polyglot.text import Text as T
from pyaspeller import YandexSpeller

morph = pymorphy2.MorphAnalyzer()
speller = YandexSpeller()


class SentimentAnalysis:

    @staticmethod
    def check_spell(text):
        changes = {change['word']: change['s'][0] for change in speller.spell(text)}
        for word, suggestion in changes.items():
            text = text.replace(word, suggestion)
        return text

    @staticmethod
    def get_polarity(text):
        text = T(text)
        word_list = text.words
        norm_list = ''

        for word in word_list:
            word = word.lower()
            word = morph.parse(word)[0].normal_form
            norm_list += word
            norm_list += ' '

        try:
            return T(norm_list).polarity
        except:
            return 0
