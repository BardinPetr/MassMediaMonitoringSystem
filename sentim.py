import polyglot
from polyglot.text import Text, Word
from polyglot.text import Text as T
import pymorphy2
from pyaspeller import YandexSpeller

morph = pymorphy2.MorphAnalyzer()
speller = YandexSpeller()

class SentimentAnalysis:

    def check_spell(self,text):
        changes = {change['word']: change['s'][0] for change in speller.spell(text)}
        for word, suggestion in changes.items():
            text = text.replace(word, suggestion)
        return text

    def get_polarity(self,text):
        text = T(text)

        word_list = text.words

        norm_list = ''
        polar = 0

        length = 0

        for word in word_list:
            word = word.lower()
            word = morph.parse(word)[0].normal_form
            norm_list += word
            norm_list += ' '

        print(norm_list)

        try:
            return T(norm_list).polarity
        except:
            return 'Neutral'

