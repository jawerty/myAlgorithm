# myAlgorithm (beta)

Your own self hosted recommendation feed based on your browsing habits.

myAlgorithm is a chrome extension I made for myself to have more control over my recommendation feeds. It tracks and stores your browsing habits (searches, clicks, content engagements, text input) _locally_ and web scraped various search engines (right now google, duckduckgo, and yandex) with auto-generated search queries.

As for privacy and security, the only server interactions made in the app are the web scraping routines (using fetch API) to make the search engine queries. Otherwise, all the data (tracking data and settings) is stored locally in browser to avoid any privacy concerns.

This project is a work in progress and available for anyone to test in the meantime.

If you like myAlgorithm and would like more tools to escape the Google algorithm donate here ---> https://www.buymeacoffee.com/bjGHFVW355
In the near future, I plan on working on these projects full time.

Here's the discord if you're interested in getting involved/contacting the developer (me) https://discord.gg/C6sYF48f

# Version

0.1

# Install

[Download the Chrome extension here.](https://chrome.google.com/webstore/detail/myalgorithm/imkkppomfljhnaaolbdgffnleejjbpjn?hl=en&authuser=0)
You must have a chromium browser (Google Chrome, Opera, Microsoft Edge, Brave Browser) in order to use myAlgorithm

### If you want to run the developer version (most up to date)

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

You are able to switch on and off which content sources you want and don't want. You can also set the ranking priorities you want for the recommendation algorithm. In addition there's a Refresh mode to update the content feed whenever (_warning_ Refresh mode can cause rate limiting in google/yandex if you run it too often)

<img width="616" alt="Screen Shot 2022-07-17 at 11 47 55 AM" src="https://user-images.githubusercontent.com/1999719/179406147-863f9409-49af-4409-b6c6-bfb63385d707.png">

# How it works

The recommendation algorithm collects keywords from your browsing habits and runs an LDA topic model to gather the prioritized terms to use to web scrape for content. The web scraping uses search queries from these topics to parse from major search engines (Google, Yandex, DuckDuckGo) to get content related to your habits.
