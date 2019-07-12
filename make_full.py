from datasources.VK import VK

from DB.DB import DB

g = VK()

a = DB()
a.add_posts(g.get_thousend_posts('гагра'))
# https://colab.research.google.com/drive/1MKPCVPBsoXHuZGqyzminWGGmxvJu6nwz