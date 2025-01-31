# Sentiment Analysis Agentic App

This application performs sentiment analysis on YouTube comments to provide insights into public opinion on a given topic.
It consists of two main components:

1. Flutter App

User Interface: Provides a user-friendly interface for users to input a topic of interest.
Data Visualization: Displays the sentiment analysis results in a visually appealing and easy-to-understand format.

2. GenKit Agent

- **YouTube Data API Integration**: Leverages the [YouTube Data API] to:
  - Search for a list of videos related to the specified topic.
  - Fetch the comments from the first video in the search results.
- **LLM-Powered Sentiment Analysis**:
  - Uses a Large Language Model (LLM) to analyze the sentiment of the collected comments.
  - Summarizes the positive and negative aspects of the topic based on the sentiment analysis.

## Demo

![](./images/demo.gif)

## Workflow

1. The user inputs a topic of interest in the Flutter app.
1. The Flutter app sends the topic to the GenKit agent.
1. The GenKit agent uses the YouTube Data API to search for relevant videos and fetch comments.
1. The GenKit agent sends the comments to the LLM for sentiment analysis.
1. The LLM analyzes the sentiment of the comments and identifies positive and negative aspects.
1. The GenKit agent sends the sentiment analysis results back to the Flutter app.
1. The Flutter app displays the results to the user.

[YouTube Data API]:https://developers.google.com/youtube/v3/docs