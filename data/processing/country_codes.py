# Country codes
import json

with open("short_map.json") as data_file:
    mapJSON = json.load(data_file)

json = "{"
for country in mapJSON:
	country_name = country["properties"]["name"]
	country_abb =  country["id"]
	json += "\""+country_name+"\""+": "+"\""+country_abb+"\","
json += "}"
print json
