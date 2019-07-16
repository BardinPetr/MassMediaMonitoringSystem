import os
import pickle
from os import path

import pymorphy2
from keras.models import load_model
from keras.preprocessing.sequence import pad_sequences
from polyglot.text import Text as T
from pyaspeller import YandexSpeller

from analytics.KMetrics import precision, recall, f1

morph = pymorphy2.MorphAnalyzer()
speller = YandexSpeller()

dependencies = {
    'precision': precision,
    'recall': recall,
    'f1': f1
}


class SentimentAnalyser:

    def __init__(self, nn=False):
        self.SENTENCE_LENGTH = 26
        self.mode = nn
        if nn:
            try:
                addr = path.join(os.getcwd().replace('analytics', '').replace('DB', ''), 'dist')
                self.model = load_model(addr + '/model.hdf5', custom_objects=dependencies)
                with open(addr + '/tokenizer.pickle', 'rb') as handle:
                    self.tokenizer = pickle.load(handle)
            except Exception as ex:
                print(ex)
                raise FileNotFoundError("No model found")

    def get_polarity(self, text):
        return self.__get_polarity_nn(text) if self.mode else self.__get_polarity_dict(text)

    @staticmethod
    def check_spell(text):
        try:
            changes = {change['word']: change['s'][0] for change in speller.spell(text)}
            for word, suggestion in changes.items():
                text = text.replace(word, suggestion)
        except Exception:
            pass
        return text

    def __to_sequences(self, x):
        sequences = self.tokenizer.texts_to_sequences(x)
        return pad_sequences(sequences, maxlen=self.SENTENCE_LENGTH)

    @staticmethod
    def __get_polarity_dict(text):
        if text == "":
            return ""
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

    def __get_polarity_nn(self, data):
        x = self.model.predict(self.__to_sequences(data if type(data) == list else [data]))
        return [i[0] for i in x] if type(data) == list else x[0][0]
