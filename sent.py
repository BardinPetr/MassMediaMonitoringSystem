import polyglot
from polyglot.text import Text, Word
from dict_of_semant import semantic_words

class Polarity:

    def polar(self, text):
        amount = 0
        opinion = 0
        text = Text(text)
        list_of_words = text.words
        for word in list_of_words:
            word = word.lower()
            if word in semantic_words[1]:
                opinion -= 1.0
                amount += 1
            elif word in semantic_words[0]:
                opinion += 1.0
                amount += 1
        return opinion/amount
        

class CountPolarity:

    def __init__(self, texts):
        self.texts = texts

    def check_length(self,length):
        for i in self.texts:
            if len(i) > length:
                self.texts.remove(i)
        return self.texts

    def check_polarity(self):
        for i in self.texts:
            if Polarity().polar(i) is not 0:
                return True
            
        return False
            

    def count_polarity(self):
        plus = 0
        minus = 0
        neutral = 0
        hype = 0
        for text in self.texts:
            text = Text(text)
            if self.check_polarity():
                hype += abs(text.polarity)
                if text.polarity > 0:
                    plus += 1
                elif text.polarity < 0:
                    minus += 1
                else:
                    neutral += 1
        average = hype/(plus+minus+neutral)

        return [average, hype, plus, minus, neutral]

#check_change


