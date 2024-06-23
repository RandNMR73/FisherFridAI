import re
import anthropic
import numpy as np

import datetime
import isodate
import requests

from dislikes import get_dislike_count

import math
from sklearn import preprocessing

# Your API key
API_KEY = 'AIzaSyBuEW6_VrihFewcGlGk44rwaa0CRaw8qMs'

client = anthropic.Anthropic()

# input jsonTree
def generateVideos(jsonTree):
    res = re.split(r'(Level \d+:)', jsonTree)
    res.remove('')
    processedTree = []
    for i in range(0, len(res) - 1, 2):
        str = res[i] + res[i + 1]
        processedTree.append(str)

    processedTree = np.array(processedTree)
    # print(processedTree)

    goal = processedTree[0][8:-6]
    # print(goal)
    processedTree = np.delete(processedTree, 0)
    prereq = ''
    for s in processedTree:
        prereq += s + ', '
    # print(processedTree)

    def generateTopics(prereq, goal):
        output = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=100,
            temperature=0,
            system="You are an all knowing AI Mentor with the goal of helping students in a compassionate way. A student will"
                "provide you with a list of prerequisite knowledge. Each entry in the list will be formatted as follows: "
                "'Level x: topic (y)', where x is an integer representing the depth of the student's knowledge. A higher value of x means"
                "that the knowledge is more basic. Then, the topic will be listed afterwards. The final part of each entry contains y,"
                "which represents the student's level of comfort with the topic. If y is positive, the student knows the topic well"
                "and if y is negative, the student does not know the content well. The format will never stray from this. After all of this," 
                "the student will provide what they want to learn. Your job is to generate a list of 4 to 6 intermediate topics that"
                "start from the student's most basic understanding and ends with the goal. Your response must be nothing other than a list.",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Prerequisite knowledge: " + prereq + "Goal: " + goal
                        }
                    ]
                }
            ]
        )

        content = output.content[0].text
        # print(content)
        learningSteps = re.split(r'(?<=\d)\.', content)
        learningSteps.remove('1')
        # print(learningSteps)
        processedSteps = []
        for i in range(len(learningSteps)):
            str = learningSteps[i]
            if i < len(learningSteps) - 1: processedSteps.append(str[:-1].strip())
            else: processedSteps.append(str.strip())
        processedSteps = np.array(processedSteps)

        return processedSteps


    learningSteps = generateTopics(prereq, goal)
    print(learningSteps)

    def search_videos(query):
        search_url = 'https://www.googleapis.com/youtube/v3/search'
        search_params = {
            'part': 'snippet',
            'q': query,
            'type': 'video',
            'maxResults': 8,  # Number of results to return
            'key': API_KEY
        }
        response = requests.get(search_url, params=search_params)
        return response.json() if response.status_code == 200 else None


    def get_video_details(video_id):
        video_url = 'https://www.googleapis.com/youtube/v3/videos'
        video_params = {
            'part': 'snippet,contentDetails,statistics',
            'id': video_id,
            'key': API_KEY
        }
        response = requests.get(video_url, params=video_params)
        return response.json() if response.status_code == 200 else None

    def fetch_videos_info(search_query):
        search_results = search_videos(search_query)
        if search_results and 'items' in search_results:
            videos_info = []
            for item in search_results['items']:
                video_id = item['id']['videoId']
                video_details = get_video_details(video_id)
                if video_details and 'items' in video_details:
                    video = video_details['items'][0]
                    video_info = {
                        "Title": video['snippet']['title'],
                        "Video ID": video_id,
                        "Channel": video['snippet']['channelTitle'],
                        "Published at": datetime.datetime.strptime(video['snippet']['publishedAt'], "%Y-%m-%dT%H:%M:%SZ"),
                        "View Count": video['statistics'].get('viewCount', 'N/A'),
                        "Like Count": video['statistics'].get('likeCount', 'N/A'),
                        "Comment Count": video['statistics'].get('commentCount', 'N/A'),
                        "Duration": isodate.parse_duration(video['contentDetails']['duration']).total_seconds(),
                        "Dislike Count": get_dislike_count(video_id)
                    }

                    # if like count is not available, set it to 0
                    if video_info["Like Count"] != "N/A":
                        if video_info["Dislike Count"] != "N/A":
                            # add like to dislike ratio
                            video_info["Like to Dislike Ratio"] = float(video_info["Like Count"]) / (
                                        int(video_info["Dislike Count"]) + 1)

                        # add like to view ratio
                        video_info["Like to View Ratio"] = float(video_info["Like Count"]) / (
                                    int(video_info["View Count"]) + 1)

                    # add comment to view ratio
                    video_info["Comment to View Ratio"] = float(0 if video_info["Comment Count"] == 'N/A' else video_info["Comment Count"]) / (
                                int(video_info["View Count"]) + 1)

                    # add recency score
                    video_info["Recency Score"] = (datetime.datetime.now() - video_info["Published at"]).days

                    videos_info.append(video_info)

            return videos_info
        else:
            return {"error": "No results found or there was an error with the search."}
        
    def convertToLists(data):
        #'View Count', 'Like Count', 'Comment Count', 'Duration', 'Dislike Count', 'Like to Dislike Ratio', 'Like to View Ratio', 'Comment to View Ratio', 'Recency Score'
        listData = np.zeros([len(data), len(data[0])])
        for i, video in enumerate(data):
            listData[i][0] = int(video['View Count'])
            if video['Like Count'] == 'N/A':
                listData[i][1] = 0
            else:
                listData[i][1] = int(video['Like Count'])
            if video['Comment Count'] == 'N/A':
                listData[i][2] = 0
            else:
                listData[i][2] = int(video['Comment Count'])
            listData[i][3] = video['Duration']
            if 'Dislike Count' not in video:
                listData[i][4] = 0
            else:
                listData[i][4] = video['Dislike Count']
            if 'Like to Dislike Ratio' not in video:
                listData[i][5] = 0
            else:
                listData[i][5] = video['Like to Dislike Ratio']
            if 'Like to View Ratio' not in video:
                listData[i][6] = 0
            else:
                listData[i][6] = video['Like to View Ratio']
            listData[i][7] = video['Comment to View Ratio']
            listData[i][8] = video['Recency Score']

        return listData

    def convertToGaussian(arr, mu_desired):
        mu = np.mean(arr)
        sigma = np.sqrt(np.var(arr))

        # get probability masses
        probs = 1/(sigma * np.sqrt(2*math.pi)) * np.exp(-(arr - mu_desired) ** 2 / (2 * sigma ** 2))
        return probs

    def videoScoreGenerator(data):
        listData = convertToLists(data)

        # handle generic cases
        indices = np.arange(13)
        desiredIndices = np.array([index for index in indices if index != 3])
        listDataModified = listData[:, desiredIndices]
        listDataModified /= listDataModified.sum(axis=1, keepdims=True)  

        # handle video duration
        videoDurationLog = np.log(listData[:, 3])
        videoDurationNormalized = convertToGaussian(videoDurationLog, 8.18868912)
        np.insert(listDataModified, 3, videoDurationNormalized)

        videoScores = np.zeros(len(listDataModified))
        for i, arr in enumerate(listDataModified):
            videoScores[i] = (arr[0] / 0.5 - 1) * 2 + 0.25 * arr[3] + (arr[5] / 0.85 - 1) * 4 + 0.7 * arr[6] * np.sqrt(int(arr[0])) + 0.1 * arr[7] + 0.25 * arr[8]
        return videoScores

    def pickVideo(data):
        videoScores = videoScoreGenerator(data)
        videoScores = preprocessing.normalize([videoScores])[0]
        top1, top2, top3, top4 = np.argsort(videoScores)[-4:]
        topVideos = np.array([top1, top2, top3, top4])
        topVideoStatistic = np.array([int(data[top1]['View Count']), int(data[top2]['View Count']), int(data[top3]['View Count']), int(data[top4]['View Count'])])
        choice = np.argmax(topVideoStatistic)
        return data[topVideos[choice]]

    videoSteps = []
    for stepQuery in learningSteps:
        videosInfo = fetch_videos_info(stepQuery)
        choice = pickVideo(videosInfo)
        videoURL = 'https://www.youtube.com/watch?v=' + choice['Video ID']
        videoSteps.append({'Video Title': choice['Title'], 'Channel Name': choice['Channel'], 'Video URL': videoURL})
    
    return np.array(videoSteps)

jsonTree = 'Level 0: creating an app with React (-2) Level 1: How comfortable are you with JavaScript fundamentals? (1) Level 1: How comfortable are you with HTML and CSS? (-1) Level 2: How comfortable are you with basic computer skills and internet browsing? (2) Level 2: How comfortable are you with text editors or code editors? (1) Level 2: How comfortable are you with understanding the structure of websites? (-1) Level 3: How comfortable are you with HTML basics? (1) Level 3: How comfortable are you with CSS fundamentals? (1) Level 3: How comfortable are you with the concept of the Document Object Model (DOM)? (-1) Level 4: How comfortable are you with HTML and its structure? (1) Level 4: How comfortable are you with JavaScript basics? (1) Level 4: How comfortable are you with web browser fundamentals? (1) Level 4: How comfortable are you with the concept of tree-like data structures? (1) Level 3: How comfortable are you with web browsers and how they render web pages? (1) Level 1: How comfortable are you with the concept of components in web development? (1) Level 1: How comfortable are you with npm (Node Package Manager) and package management? (1)'
videoSteps = generateVideos(jsonTree)
print(videoSteps)