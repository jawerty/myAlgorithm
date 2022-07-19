/* (simple) behavior db
keyword db JSON
{
    [KEYWORD]: {
        search_intensity: Number,
        click_intensity: Number,
        engagement_intensity: Number,
        engagment_time_intensity: Number,
        text: String,
        [occurences]: Number,
        [occurrences_ts]: [Date], // only store from past week
        [last_interaction_ts]: Date,
        [interaction_intensity?]: Number, (is this typed in an input, searched on google, or something they clicked on out of interest)
    }
}

Feed Settings (managed from settings db)
{   
    priorities in ranking (1-5)
        searches
        clicks
        engagement
        engagement time
    randomness meter
    facebook content
    Refresh Time
        - Extension Open 
        - Hourly
        - Daily
        - Weekly
    - Create New Tab with Content Feed 
    open content page on browser open
    refresh back to default
}

Topic Settings (managed from keyword db)
{
    view topics and their rankings
    remove topics
    Add topics
    derank topics
}

Todo:
- Create assets/branding
- Post to chrome store 
- Post to HN - "myAlgorithm - I created a personal recommendation feed to escape the algorithm"
- Write Github Readme
- Create branding and education copy
- Create topic (keyword) viewer/crud interface
    - Same as Youtube MyAlgorithm?
- Figure out how to source content without google but keep the app serverless
    - same search with yandex/duckduckgo (first do this)
    - find more static search engines
        - is reddit static?
        - is quora static?
        - hn algolia
        - stack exchange 
        - yelp
        - facebook
    - get data from iframes by taking a screenshot a of webpage and parsing it in chrome extension
        - wayyy too complicated
 - Create feed settings UI (done)
    - Also figure out/implement all the useful settings 
- Add sources to settings (quora, bitchute, youtube, twitter, reddit) (done)
- add hacker news to sources (use hn algolia)
- add stack exchange to sources (try stack exchange search)
- Make keywords x10 better
    - Try to fix nouns being too generic issue
    - get tweet clicks (done) 
    - and all youtube video clicks (done)
    - make input type ending check longer (done)
    - ignore only numbers (done)
    - ignore urls (done)
- Create content block styles for each platform you have so far (done)
- Create Algorithm Editor (dashboard)
    - Graph on top 10 engagement websites (done)
    - Graph based on top 5 topics you're into (almost)
    and then I'm going to show the keywords
    - clear keywords (done)
    - add keyword
- On content feed page show you don't have any keywords yet start browsing! (done) 
- fix service worker inactive (almost done)
- Add setting to change search engines where source are fetched from? (maybe)
- create lda model and use it for ranking and topic graph

- figure out how to get bitchute (unauthorized content) without google

- create UI for feed/topic settings (topics is more of a viewer)
- create UI for feed
    - have a smart way for viewing content with branding from origin site
        - maybe just hardcode branding from a couple dozen popular sites
            - branding is the name, the image and the primary color 
- Done v1
- Next step solve the issue of showing "What's happening" - the functionality of twitter
    - Build a better version of twitters "trending" and search for what is "happening"
    - That's where the social media addiction lies

When to run (extension onload if the last time fetched is before 6am that day)
- get 10 ranked searches (most to least ranked)
- for each content slot (10)
    - get random seach engine
    - use search query and get top result (next step - most "relevant" result)

Search Routines
(Must)
Youtube 
Twitter
Reddit
Bitchute
Quora
Hacker News
(Good to have)
Hacker News
Google News
(If I'm feeling lucky)
Stack Overflow
Yelp
Facebook (if user turns it on and is logged in)

Run Content Fetching Routines in the popup
// Loading Content Feed of the day in popup (do fetching in popup as well (or at least fetching processing))
    // Use hidden iframes as a in browser selenium
// Content loaded (content feed page must be able to exist in popup and in website)
// Create UI with settings 
*/

importScripts('./Readability.js');
importScripts('./lda.js');
importScripts('./compromise.js');
importScripts('./storage.js');
importScripts('./ranking.js');

const runtimeObjects = {}

const initFeedSettings = async () => {
    if (!runtimeObjects[storage.KEYS.feed_settings]
        || Object.keys(runtimeObjects[storage.KEYS.feed_settings]).length === 0) {
        console.log("init feed settings");
        const newFeedSettings = new FeedSettings({});
        await storage.save(storage.KEYS.feed_settings, newFeedSettings)
    }
}

const parseKeywordsFromText = (text) => {
    const wordsToIgnore = ['more', 'an', 'of', 'on', 'heres', 'set', 'it', 'if',  'my', 'your', 'in', 'everyone', 'fe', 'me', 'us', 'someone', 'we', 'that', 'i', 'im', 'am', 'he', 'she', 'you', 'them', 'they', 'what', 'the', 'his', 'her', 'hers'];

	const doc = nlp(text);
    const namedEntities = Object.assign(doc.nouns().data(), doc.topics().data());

    return namedEntities.map((entity) => {
        if (entity.text.indexOf('https://') === 0 || entity.text.indexOf('https://') === 0) {            
            return '';
        }          

        const parsedEntity = entity.text.replace(/[^\w\s]/gi, '').replace(/\s+/g, " ");
        console.log("Found:", parsedEntity.toLowerCase());

        if (parsedEntity == parseInt(parsedEntity)) {
            return '';
        };
        if (wordsToIgnore.includes(parsedEntity.toLowerCase().trim())) {
            return '';
        }
        if (parsedEntity.toLowerCase().length < 2) {
            return '';
        }
        return parsedEntity.toLowerCase().trim();
    }).filter((entity) => {
        return entity.length > 0;
    });
}

const processEngagementText = async (text, newEngagementType, sourceDomain) => {
    const keywords = parseKeywordsFromText(text.join(' '));
    console.log("keywords found:", keywords);
    if (!runtimeObjects[storage.KEYS.keywords]) {
        runtimeObjects[storage.KEYS.keywords] = await storage.get(storage.KEYS.keywords);
    }
    const keywordsToSave = keywords.map((keyword) => {
        let pastKeywordObject;
        if (keyword in runtimeObjects[storage.KEYS.keywords]) {
            pastKeywordObject = runtimeObjects[storage.KEYS.keywords][keyword]
        } else {
            pastKeywordObject = {
                text: keyword,
                occurrences: 0,
                history: {},
                engagementTypes:  {
                    'search-query': 0,
                    'meta-keywords': 0,
                    'meta-title': 0,
                    'link-click': 0,
                    'content-click': 0,
                    'input-type': 0,
                    'custom': 0
                }
            }
        }
        return JSON.parse(JSON.stringify(new Keyword(pastKeywordObject, newEngagementType, sourceDomain)));
    });

    try {
        const keywordsToSaveMap = {};
        for (let keywordToSave of keywordsToSave) {
            keywordsToSaveMap[keywordToSave.text] = keywordToSave;
        }
        const newRuntimeKeywords = Object.assign(runtimeObjects[storage.KEYS.keywords], keywordsToSaveMap);
        await storage.save(storage.KEYS.keywords, newRuntimeKeywords);
        console.log("keywords saved", newRuntimeKeywords);
    } catch(e) {
        console.log("keyword save BROKE for query:", text, e);
    }
}

const init = () => {
    chrome.webRequest.onHeadersReceived.addListener(
        async (data) => {
            if (data.type === "main_frame") {
                const url = data.url;
                try {
                    const urlObj = new URL(url);
                    if (urlObj.search[0] === "?") {
                       for (let queryItem of urlObj.search.slice(1).split('&')) {
                        if (queryItem.split('=')[0] === 'q') {
                            const searchQuery = queryItem.split('=')[1].split('+');
                            console.log("searchQuery found:", searchQuery)
                            processEngagementText(searchQuery, 'search-query', urlObj.hostname)
                        }
                       }
                    }
                } catch(e) {
                    console.log(e);
                }
            }
        },
        {urls: ["<all_urls>"]}
      )

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log("background request made:", request);


        if (request.action === 'myalgorithm-init') {
            sendResponse({
                status: true
            })
        } else if (request.action === "newEngagementText") {
            const engagementText = request.text;
            processEngagementText(engagementText, request.type, request.sourceDomain);

            sendResponse({
                processedEngagementText: true
            });
        } else if (request.action === "getContentFeed") {
            if (runtimeObjects[storage.KEYS.fetched_ts]) {
                const now = new Date();
                const resetTime = new Date();
                resetTime.setHours(6, 0, 0, 0);
                if (now.getTime() < resetTime.getTime()) {
                    console.log("sending back content 1")
                    sendResponse({
                        contentFeed: runtimeObjects[storage.KEYS.content_feed] || null
                    });
                } else {
                    if (runtimeObjects[storage.KEYS.fetched_ts] >=  resetTime.getTime()) {
                        console.log("sending back content 2")
                        sendResponse({
                            contentFeed: runtimeObjects[storage.KEYS.content_feed] || null
                        });
                    } else {
                        sendResponse({
                            contentFeed: null
                        });
                    }
                } 
            } else {
                sendResponse({
                    contentFeed: null
                })
            }
        } else if (request.action === "saveContentFeed") {
            storage.save(storage.KEYS.content_feed, request.contentFeed)
            storage.save(storage.KEYS.fetched_ts, (new Date()).getTime())

            sendResponse({
                save: true
            });
        }  else if (request.action === "getTopics") {
            const rankedKeywords = rankKeywords(
                runtimeObjects[storage.KEYS.keywords], 
                runtimeObjects[storage.KEYS.feed_settings]
            )

            if (rankedKeywords.length === 0) {
                sendResponse({
                    topics: null
                });
            } else {
                const topics = generateKeywordTopics(rankedKeywords, true)
                sendResponse({
                    topics
                });
            }
            
        }else if (request.action === "getSearchQueries") {
            const rankedKeywords = rankKeywords(
                runtimeObjects[storage.KEYS.keywords], 
                runtimeObjects[storage.KEYS.feed_settings]
            )
            let topics = []
            if (rankedKeywords.length > 0) {
                topics = generateKeywordTopics(rankedKeywords)
            }
            console.log("topics", topics)
            const searchQueries = [];
        
            for (let contentIndex = 0; contentIndex < topics.length; contentIndex += 1) {
                const makeRandom = Math.floor((Math.random()*100)) > 66; // 33% random
                const searchQuery = buildSearchQuery(topics, rankedKeywords, contentIndex, makeRandom);
                searchQueries.push(searchQuery)
            }
            console.log("searchQueries", searchQueries)
            sendResponse({
                searchQueries
            });
        } else if (request.action === "getKeywords") {
            if (runtimeObjects[storage.KEYS.keywords]) {
                sendResponse({
                    keywords:  Object.values(runtimeObjects[storage.KEYS.keywords])
                })
            }
            
        } else if (request.action === "getFeedSettings") {
            if (runtimeObjects[storage.KEYS.feed_settings]) {
                sendResponse({
                    feedSettings:  runtimeObjects[storage.KEYS.feed_settings]
                })
            }
            
        } else if (request.action === "saveFeedSettings") {
            if (request.newFeedSettings) {
                console.log("saved feed settings", request.newFeedSettings)
                storage.save(storage.KEYS.feed_settings, request.newFeedSettings)
                sendResponse({})
            }
        } else if (request.action === "removeKeyword") {
            const keywordToRemove = request.keyword;
            if (keywordToRemove in runtimeObjects[storage.KEYS.keywords]) {
                delete runtimeObjects[storage.KEYS.keywords][keywordToRemove];
                storage.save(storage.KEYS.keywords, runtimeObjects[storage.KEYS.keywords])
                sendResponse({});
            }
        } else if (request.action === "clearKeywords") {
            storage.save(storage.KEYS.keywords, {});
            sendResponse({});
        } else if (request.action === "addTopic") {
            processEngagementText([request.keyword], 'custom', null)
            sendResponse({});
        }

        return true;
    }); 
}


(async function() {
    init();

    runtimeObjects[storage.KEYS.keywords] = await storage.get(storage.KEYS.keywords);
    runtimeObjects[storage.KEYS.feed_settings] = await storage.get(storage.KEYS.feed_settings);
    runtimeObjects[storage.KEYS.fetched_ts] = await storage.get(storage.KEYS.fetched_ts);
    runtimeObjects[storage.KEYS.content_feed] = await storage.get(storage.KEYS.content_feed);
    
    initFeedSettings();
    
    console.log("INIT runtime", runtimeObjects)
})();

