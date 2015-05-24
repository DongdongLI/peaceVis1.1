# Python to exctract and organize predictive features into one file

k=0
countryDict = {}
for line in open("MERGED_ECON_WAR_FINAL.csv"):
	if k==0:
		k+=1
		continue
	line = line.split(",")
	country = line[2]
	year = line[5]
	unemployment = line[30]
	if unemployment=="":
		unemployment="0"
	GDP = line[9]
	if GDP=="":
		GDP="0"
	national = line[21]
	if national=="":
		national="0"
	debt = line[15]
	if debt=="":
		debt="0"
	expenditure = line[18]
	if expenditure=="":
		expenditure="0"
	if country in countryDict:
		if year not in countryDict[country]:
			countryDict[country][year] = [unemployment, GDP, national, debt, expenditure]
	else:
		countryDict[country] = {}
		countryDict[country][year] = [unemployment, GDP, national, debt, expenditure]
	k+=1
	# if k==50:
	# 	break

cFlag = 0
json = "{"
first1 = 0
last1 =len(countryDict)
for idx1, country in enumerate(countryDict):
	json+= "\n\""+country+"\":{"
	for idx2, year in enumerate(countryDict[country]):
		last2 =len(countryDict[country])
		json+= "\n\""+year+"\":"
		if idx1==last1-1 and idx2==last2-1:
			json += "\n[\""+countryDict[country][year][0]+"\", \""+countryDict[country][year][1]+"\", \""+countryDict[country][year][2]+"\", \""+countryDict[country][year][3]+"\", \""+countryDict[country][year][4]+"\"]\n}"
		elif idx2==last2-1:
			json += "\n[\""+countryDict[country][year][0]+"\", \""+countryDict[country][year][1]+"\", \""+countryDict[country][year][2]+"\", \""+countryDict[country][year][3]+"\", \""+countryDict[country][year][4]+"\"]\n},"
		else:
			json += "\n[\""+countryDict[country][year][0]+"\", \""+countryDict[country][year][1]+"\", \""+countryDict[country][year][2]+"\", \""+countryDict[country][year][3]+"\", \""+countryDict[country][year][4]+"\"],"
json += "\n}"
# print json

# Open a file
fo = open("pFeatures.json", "wb")
fo.write(json);

# Close opend file
fo.close()

