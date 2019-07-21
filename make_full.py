from DB.DB import DB
from datasources.VK import VK

g = VK()

a = DB()
# a.add_posts(g.get_posts('керчь'))
# https://colab.research.google.com/drive/1MKPCVPBsoXHuZGqyzminWGGmxvJu6nwz

print(g.get_users_info())
