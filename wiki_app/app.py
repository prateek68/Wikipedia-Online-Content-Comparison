from flask import Flask , jsonify, Response
from flask_cors import CORS
import wptools
import WikiExtractor
import requests
import json
import re
from wikipedia2vec import Wikipedia2Vec
import time
import numpy as np

app = Flask(__name__)
CORS(app)

init_file = open('init.txt','r')
line = init_file.readline()
implement_keyword_ranking = 'False'
implement_keyword_ranking = line.split('=')[1]
implement_keyword_ranking = implement_keyword_ranking.strip()
if(implement_keyword_ranking == 'True'):
    start = time.process_time()
    f = open("enwiki_20180420_100d.pkl.bz2","rb")
    print("loading file")
    wiki2vec = Wikipedia2Vec.load(f)
    print("file loaded successfully")
    end = time.process_time()
    print("Time taken to load pre-trained model")
    print(end-start)
print("------------------------------------------------------------------------------------")
@app.route('/')
def hello_world():
    return 'Hello, World!'
@app.route('/title/<title>/<primary>',methods = ['GET'])
def get_keywords(title,primary):

    url_non_en = "https://" + primary +".wikipedia.org/wiki/Special:Export/" +title
    resp = requests.get(url_non_en)
    with open('non_en.xml', 'wb') as f: 
        f.write(resp.content)
    
    page = wptools.page(title,lang = primary)
    # page = wptools.page(title,lang = "hi")
    page.get_parse()
    wikidata_id = page.data['wikibase']
    # print("Wikidata Id obtained :" + wikidata_id)
    page_en = wptools.page(wikibase = wikidata_id)
    page_en.get_wikidata()
    title_en = page_en.data['title']
    url_en = "https://en.wikipedia.org/wiki/Special:Export/" + title_en
    resp = requests.get(url_en)
    with open('eng.xml', 'wb') as f: 
        f.write(resp.content)
    
    # Execute the WikiExtractor.py code to process the non-en and en XMLs
    WikiExtractor.main()
    print("Code Executed")
    non_en_text = ""
    en_text = ""
    with open("non_en/AA/wiki_00",'r') as f:
        non_en_text = f.read()
        f.close()
    with open("en/AA/wiki_00",'r') as f:
        en_text = f.read()
        f.close()
    # page_en = wptools.page(title_en)
    # page_en.get_parse()

    url = "https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&redirects=1&titles=" + title_en
    url += "&format=json"
    resp = requests.get(url)
    data = resp.content
    data = data.decode('utf8')
    data = json.loads(data)
    pages = data["query"]["pages"]
    for items in pages:
        # print(items)
        try:
            ID = pages[items]["pageprops"]["wikibase_item"]
            title_en = pages[items]["title"]
        except KeyError:
            continue
    print("Title English")
    print(title_en)
    # --------------------------------- Obtain section headings from the English XML page ------------------------

    section_headings = [i.start() for i in re.finditer("<sec>", en_text)]
    section_headings_end = [i.start() for i in re.finditer("</sec>", en_text)]
    print(len(section_headings))
    headings = []
    headings_pos = []
    for j in range(len(section_headings)):
        occurence = section_headings[j]
        title = en_text[occurence + 5:section_headings_end[j]-1]
        headings.append(title)
        headings_pos.append(section_headings_end[j]+6)

    # --------------------------------- Part Considering anchor text as keywords----------------------------------
    start = time.process_time()
    keywords_en = []
    keywords = []
    occur_en = [i.start() for i in re.finditer("href", en_text)]
    end_occur_en = [i.start() for i in re.finditer("</a>", en_text)]
    occur = [i.start() for i in re.finditer("href", non_en_text)]
    end_occur = [i.start() for i in re.finditer("</a>", non_en_text)]

    pos_keywords_en = {}
    for j in range(len(occur_en)):
        occurence = occur_en[j]
        title = ""
        pos = occurence + 6
        while(en_text[pos]!="\""):
            title+=en_text[pos]
            pos+=1
        pos+=2
        # print(title)
        url = title
        # print(en_text[pos:end_occur_en[j]])
        title = en_text[pos:end_occur_en[j]]
        # title = title.lower()
        if(title_en.find(title)!=-1):
            continue
        elif( (len(url)/len(title)) > 3 ):
            continue
        if title in pos_keywords_en :
            repitition = True
        else:
            pos_keywords_en[title] = occurence + 6
        keywords_en.append(title)

    for j in range(len(occur)):
        occurence = occur[j]
        title = ""
        pos = occurence + 6
        while(non_en_text[pos]!="\""):
            title+=non_en_text[pos]
            pos+=1
        pos+=2
        url = title
        title = non_en_text[pos:end_occur[j]]
        if(title == 'के'):
            continue
        keywords.append(title)
    
    dict_keys ={}
    dict_keys_en = {}
    mappings_eng = {}
    mappings_non_en = {}
    for i in range(0,len(keywords_en),50):
        # print(i)
        url = "https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&redirects=1&titles="
        count = 0
        j = i
        while(j<len(keywords_en) and count<50):
            url += keywords_en[j]
            # url += urls_en[j]
            if(count !=49):
                url+="|"
            count+=1
            j+=1
        url += "&format=json"
        resp = requests.get(url)
        data = resp.content
        # print(data.json())
        data = data.decode('utf8')
        data = json.loads(data)
        pages = data["query"]["pages"]
        for items in pages:
            # print(items)
            try:
                ID = pages[items]["pageprops"]["wikibase_item"]
                title = pages[items]["title"]
                dict_keys_en[ID] = title
                mappings_eng[title]= title
            except KeyError:
                # print("error")
                continue
        normalizations = {}
        try:

            normalized = data["query"]["normalized"]
            for items in normalized:
                try:
                    normalizations[items["to"]]=items["from"]
                except KeyError:
                    continue
        except KeyError:
            continue
        try:

            redirects = data["query"]["redirects"]
            for items in redirects:
                try:
                    if items["from"] in normalizations:
                        mappings_eng[items["to"]]=normalizations[items["from"]]
                    else:
                        mappings_eng[items["to"]]=items["from"]
                except KeyError:
                    continue
        except KeyError:
            continue


    
    for i in range(0,len(keywords),50):
        # print(i)
        url = "https://" + primary + ".wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&redirects=1&titles="
        count = 0
        j = i
        while(j<len(keywords) and count<50):
            url += keywords[j]
            # url += urls[j]
            if(count !=49):
                url+="|"
            count+=1
            j+=1
        url += "&format=json"
        resp = requests.get(url)
        data = resp.content
        # print(data.json())
        data = data.decode('utf8')
        data = json.loads(data)
        pages = data["query"]["pages"]
        for items in pages:
            # print(items)
            try:
                ID = pages[items]["pageprops"]["wikibase_item"]
                title = pages[items]["title"]
                dict_keys[ID] = title
                mappings_non_en[title] = title
            except KeyError:
                # print("error")
                continue
        normalizations = {}
        try:

            normalized = data["query"]["normalized"]
            for items in normalized:
                try:
                    normalizations[items["to"]]=items["from"]
                except KeyError:
                    continue
        except KeyError:
            continue
        try:

            redirects = data["query"]["redirects"]
            for items in redirects:
                try:
                    if items["from"] in normalizations:
                        mappings_non_en[items["to"]]=normalizations[items["from"]]
                    else:
                        mappings_non_en[items["to"]]=items["from"]
                except KeyError:
                    continue
        except KeyError:
            continue
    print(len(dict_keys_en))
    print(len(dict_keys))
    # translator = Translator()
    

    relevant_english = []
    for keys in dict_keys_en:
        try:
            temp = dict_keys[keys]
        except:
            # relevant_english.append(dict_keys_en[keys])
            relevant_english.append( mappings_eng[dict_keys_en[keys]])
    unique_non_en = []
    s = 0
    for keys in dict_keys:
        try:
            temp = dict_keys_en[keys]
        except:
            # unique_non_en.append(dict_keys[keys])
            unique_non_en.append(mappings_non_en[dict_keys[keys]])
    relevant_english_links = []
    base_link = "https://en.wikipedia.org/wiki/" + title_en.replace(" ","_")
    # print(relevant_english)
    # print(pos_keywords_en)
    for key_title in relevant_english:
        # key_title = key_title.lower()
        section_level = len(headings_pos) -1
        if(key_title not in pos_keywords_en):
            relevant_english_links.append(base_link)
            continue
        while(section_level>=0):
            if(pos_keywords_en[key_title]>headings_pos[section_level]):
                break
            section_level= section_level -1

        if(pos_keywords_en[key_title]<headings_pos[0]):
            relevant_english_links.append(base_link)
        else:
            link_to_section = base_link + "#" + headings[section_level].replace(" ","_")
            relevant_english_links.append(link_to_section)
        # chl position here
    end = time.process_time()
    print("Time taken to obtain mapping between keywords and page ids")
    print(end-start)

    print("--------------------------------------------------------------------------------")
    print("Wikipedia2vec execution begins")
    start = time.process_time()

    similarity_score = []
    entity_found = False
    try:
        title_vec = wiki2vec.get_entity_vector(title_en)
        entity_found = True
    except:
        entity_found = False
    count = 0
    if(entity_found):
        out = open("scores.txt","w")
        for i in range(len(relevant_english)):
            score = 0
            try:
                key_vec = wiki2vec.get_entity_vector(relevant_english[i])
                dot = np.dot(title_vec, key_vec)
                norma = np.linalg.norm(title_vec)
                normb = np.linalg.norm(key_vec)
                cos = dot / (norma * normb)
                score = cos
            except:
                key_found = False
                count+=1
                score = 0
            similarity_score.append(score)
            out.write(str(relevant_english[i]) + "--> " + str(similarity_score[i]) + "\n")
        print("Len relevant english and similariy score")
        print(len(relevant_english))
        print(len(similarity_score))
        order = np.argsort(similarity_score)
        print(len(order))
        other_index = []
        other_index_link= []
        for i in range(len(order)):
            other_index.append(relevant_english[order[(len(order) - 1 ) - i]])
            other_index_link.append(relevant_english_links[order[(len(order) - 1 ) - i]])
        relevant_english = other_index
        relevant_english_links = other_index_link
    else:
        do_something = 0
        count = -1
        # the relevant english list, unchanged needs to be shown, as the Wikipedia2vec hasn't returned any entity vector for the title
        # keywords itself and therefore we cannot calculate the similarity values between the title and the extracted keywords
    print(len(relevant_english))
    # print(final)
    end = time.process_time()
    print("Time taken to get similarity scores")
    print(end-start)
    print("API calls completed")
    print("Keys not found = ")
    print(count)
    # out.close()

    # --------------------------------- Part Considering anchor text as keywords Ends-----------------------------

    ans ={}
    URL_en = "https://en.wikipedia.org/wiki/" + title_en
    ans['url_en'] = URL_en
    ans["keywords"] = unique_non_en
    ans["English_keywords"] = relevant_english
    ans['links'] = relevant_english_links
    temp = jsonify(ans)
    temp.status_code = 200

    return temp

def get_text(id):
    page = wptools.page(wikibase = id,lang = en)
    # page
if __name__ == "__main__":
    app.run(host="192.168.59.120",port=5000)
# for i in res:
# ...     title = ""
# ...     pos = i + 6
# ...     while(input[pos]!="\""):
# ...             title+=input[pos]
# ...             pos+=1
# ...     print(title)


