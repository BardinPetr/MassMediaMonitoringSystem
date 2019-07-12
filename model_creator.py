import _pickle as pickle

import numpy as np

# from dictionary_words import dictio,dictio1

dictionary = {}  # insert your dictionary

with open('ru.sent.pkl', 'rb') as f:
    u = pickle.Unpickler(f, encoding="latin1")
    # u.encoding = 'latin1'
    p = u.load()

first_list_of_words = [i for i in p[0]]

# print(first_list_of_words)


items = [i for i in dictionary.keys() if dictionary[i] != '0' and i not in first_list_of_words]

# print(len(first_list_of_words))
# print(len(items))


list_of_words = first_list_of_words + items
# list_of_words = items

a = 0
for i in items:
    if items.count(i) > 1:
        a += 1
print(a)

# print(list_of_words)

values = [int(dictionary[key]) for key in dictionary.keys() if
          dictionary[key] != '0' and key not in first_list_of_words]

# print(values)
# print('-----------------------------------------')

a = p[1].tolist()
a = [i[0] for i in a]

list_of_values = a + values
# list_of_values = values


list_of_values = [[i] for i in list_of_values]

values = np.array(list_of_values)

np.reshape(values, (1, len(values)))

# print(values)

out = (list_of_words, values)

output = open('myfile.pkl', 'wb')
pickle.dump(out, output)
output.close()
