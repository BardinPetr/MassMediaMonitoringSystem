import pymongo


class Vk():
    """Class created for VK IP"""

    def __init__(self):
        self.myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        self.mydb = self.myclient["mydatabase"]
        self.mycol = self.mydb["customers"]
        """initialization """

    def add_name(self, mylist):
        """Add my names"""
        x = self.mycol.insert_many(mylist)
        print(x.inserted_ids)

    def display_all_names(self):
        return self.mycol.find()

    """return and print my names"""


a = Vk()
print(list(a.display_all_names()))
