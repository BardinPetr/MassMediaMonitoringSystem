from Twitter import Twitter
import json

x = Twitter()

'''with open('sosi.xui.json','wb') as json_file:
    json.dump(a.get_posts('москва',1), json_file)'''


a = x.get_posts('москва',3)[0]


s = json.dumps(a._json)

print(s)