importScripts('./Readability.js');
importScripts('./lda.js');
importScripts('./compromise.js');
importScripts('./storage.js');
importScripts('./ranking.js');

const runtimeObjects = {}

const initFeedSettings = async () => {
    const updateDefaultsFeedSettings = async (feedSettings) => {
        const newFeedSettings = new FeedSettings(feedSettings);
        await storage.save(storage.KEYS.feed_settings, newFeedSettings)
    }

    if (!runtimeObjects[storage.KEYS.feed_settings]
        || Object.keys(runtimeObjects[storage.KEYS.feed_settings]).length === 0) {
        console.log("init feed settings");
        const newFeedSettings = new FeedSettings({});
        await storage.save(storage.KEYS.feed_settings, newFeedSettings)
    } else {
        console.log('updating feed setting with defaults')
        updateDefaultsFeedSettings(runtimeObjects[storage.KEYS.feed_settings])
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
            if (runtimeObjects[storage.KEYS.feed_settings].disableAlgorithm) {
                return;
            }
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
            if (runtimeObjects[storage.KEYS.feed_settings].disableAlgorithm) {
                sendResponse({
                    processedEngagementText: false
                });
            } else {
                const engagementText = request.text;
                processEngagementText(engagementText, request.type, request.sourceDomain);
    
                sendResponse({
                    processedEngagementText: true
                });
            }
            
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
                searchQueries,
                customSources: runtimeObjects[storage.KEYS.custom_sources] // not great structure here but I didn't want to do another request in ContentFeed.js
            });

        } else if (request.action === "getKeywords") {
            if (runtimeObjects[storage.KEYS.keywords]) {
                sendResponse({
                    keywords:  Object.values(runtimeObjects[storage.KEYS.keywords])
                })
            } else {
                sendResponse({ keywords: null })
            }
            
        } else if (request.action === "getFeedSettings") {
            if (runtimeObjects[storage.KEYS.feed_settings]) {
                sendResponse({
                    feedSettings:  runtimeObjects[storage.KEYS.feed_settings]
                })
            } else {
                sendResponse({ feedSettings: null })
            }
            
        } else if (request.action === "saveFeedSettings") {
            if (request.newFeedSettings) {
                console.log("saved feed settings", request.newFeedSettings)
                runtimeObjects[storage.KEYS.feed_settings] = request.newFeedSettings;
                storage.save(storage.KEYS.feed_settings, request.newFeedSettings)
                sendResponse({})
            } else {
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
        } else if (request.action === "addCustomSource") {
            const customSourceData = request.customSourceData;
            if (Object.keys(runtimeObjects[storage.KEYS.custom_sources]).includes(customSourceData.domain)) {
                sendResponse({
                    success: false,
                    message: "Content source already exists"
                });
            } else {
                runtimeObjects[storage.KEYS.custom_sources][customSourceData.domain] = customSourceData;
                storage.save(storage.KEYS.custom_sources, runtimeObjects[storage.KEYS.custom_sources]);
                sendResponse({
                    success: true,
                    message: null
                });
            }
        } else if (request.action === "editCustomSource") {
            const customSourceDomain = request.customSourceDomain;
            const enabled = request.enabled;
    
            if (Object.keys(runtimeObjects[storage.KEYS.custom_sources]).includes(customSourceDomain)) {
                runtimeObjects[storage.KEYS.custom_sources][customSourceDomain].checked = enabled;
                storage.save(storage.KEYS.custom_sources, runtimeObjects[storage.KEYS.custom_sources]);
                sendResponse({
                    success: true,
                    message: null
                });
            } else {
                sendResponse({
                    success: false,
                    message: "Source does not exist"
                });
            }
        } else if (request.action === "removeCustomSource") {
            const customSourceDomain = request.customSourceDomain
            if (Object.keys(runtimeObjects[storage.KEYS.custom_sources]).includes(customSourceDomain)) {
                delete runtimeObjects[storage.KEYS.custom_sources][customSourceDomain];
                storage.save(storage.KEYS.custom_sources, runtimeObjects[storage.KEYS.custom_sources]);
                sendResponse({
                    success: true,
                    message: null
                });
            } 
        } else if (request.action === 'getCustomSources') {
            if (runtimeObjects[storage.KEYS.custom_sources]
                && Object.keys(runtimeObjects[storage.KEYS.custom_sources]).length > 0) {
                sendResponse({
                    customSources: runtimeObjects[storage.KEYS.custom_sources]
                });
            } else {
                sendResponse({
                    customSources: null
                }); 
            }
        } else {
            sendResponse({})
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
    runtimeObjects[storage.KEYS.custom_sources] = await storage.get(storage.KEYS.custom_sources);
    
    initFeedSettings();
    
    console.log("INIT runtime", runtimeObjects)
})();

