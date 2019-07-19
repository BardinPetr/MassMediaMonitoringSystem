import json
from os import path, getcwd

address = path.join(getcwd()
                    .replace('DB', '')
                    .replace('datasources', '')
                    .replace('analytics', ''))

credentials = json.load(open(address + '/credentials.json'))
