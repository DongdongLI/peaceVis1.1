# Python summarize all aggression events per country

aggressDict = {}
k=0

for line in open("ConflictData1980plusCleansed.csv"):
	k+=1
	line = line.split(",")
	country = line[1]
	aggressValue = line[13].replace("\r\n", "")
	if country in aggressDict:
		aggressDict[country] += int(aggressValue)
	else:
		aggressDict[country] = 0

# print aggressDict

json = "{"
for key, value in aggressDict.iteritems():
	json += "\""+key+"\": "+str(value)+",\n"
json += "}"
# print json

# Open a file
fo = open("aggressCountries.json", "wb")
fo.write(json);

# Close opend file
fo.close()
