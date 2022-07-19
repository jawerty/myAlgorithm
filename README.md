# myAlgorithm (beta)
Your own self hosted recommendation feed based on your browsing habits. 

myAlgorithm is a chrome extension I made for myself to have more control over my recommendation feeds. It tracks and stores your browsing habits (searches, clicks, content engagements, text input) *locally* and web scraped various search engines (right now google, duckduckgo, and yandex) with auto-generated search queries.

As for privacy and security, the only server interactions made in the app are the web scraping routines (using fetch API) to make the search engine queries. Otherwise, all the data (tracking data and settings) is stored locally in browser to avoid any privacy concerns. 

This project is a work in progress and available for anyone to test in the meantime.

# Version
0.1

# Install
This is a *Chrome extension* so you must have Chrome in order to use myAlgorithm

### If you have chrome
Fork the repo and then follow this tutorial on loading an unpacked extension in Chrome [https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/)

# How to use?
Simply use your browser like how you would normally. In realtime you'll be able to see topics relating to your usage in the extension popup.

# The Content Feed
You will get a daily feed of content (also an option to refresh at will) after 6am everyday. It will have roughly 10 pieces of content from on your allowed sources (youtube videos, twitter posts, reddit posts, etc.) based on your browsing habits

<img width="572" alt="Screen Shot 2022-07-17 at 11 38 30 AM" src="https://user-images.githubusercontent.com/1999719/179406128-f3332e03-cd85-4480-b98c-cf48bbd006be.png">

# Algorithm Editor
The Algorithm Editor is a dashboard to view and edit your recommendation algorithm. You can see two graphs detailing your overall browsing habits. Below you have the option to view, add and remove all of the topics that will be used in the web scraping routines (these are ranked by occurrences, ranking prorities and partially randomized)

<img width="623" alt="Screen Shot 2022-07-17 at 11 47 44 AM" src="https://user-images.githubusercontent.com/1999719/179406137-1b320f9e-fa8e-4d5b-ae04-5c333aec8827.png">

# Feed settings
You are able to switch on and off which content sources you want and don't want. You can also set the ranking priorities you want for the recommendation algorithm. In addition there's a Refresh mode to update the content feed whenever (*warning* Refresh mode can cause rate limiting in google/yandex if you run it too often)

<img width="616" alt="Screen Shot 2022-07-17 at 11 47 55 AM" src="https://user-images.githubusercontent.com/1999719/179406147-863f9409-49af-4409-b6c6-bfb63385d707.png">