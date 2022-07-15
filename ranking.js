function rankKeywords(keywords, feedSettings) {
    return Object.keys(keywords).map((keywordText) => {
        const keyword = keywords[keywordText];
        const searchQueryOccurrences = keyword.engagementTypes['search-query'];
        const metaOccurrences = keyword.engagementTypes['meta-keywords'] + keyword.engagementTypes['meta-title'];
        const clicksOccurrences = keyword.engagementTypes['link-click'] + keyword.engagementTypes['content-click'];
        const generalInputOccurrences = keyword.engagementTypes['input-type'];
        const customOccurrences = keyword.engagementTypes['custom'];

        const score = (feedSettings.priorities.metaInfo * metaOccurrences)
            + (feedSettings.priorities.searchQuery * searchQueryOccurrences)
            + (feedSettings.priorities.clicks * clicksOccurrences)
            + (feedSettings.priorities.generalInput * generalInputOccurrences)
            + (5 * customOccurrences); // default to a lot
        
        keyword.score = score;
        return keyword
    }).sort((a, b) => {
        return b.score - a.score;
    });
}

function buildSearchQuery(rankedKeywords, index, random) {
    const queryTypes = ['single-sorted', 'double-sorted']
    const randomQueryTypes = ['single-random', 'double-random'];

    if (random) {
        const randomQueryType = randomQueryTypes[Math.floor(Math.random()*randomQueryTypes.length)];
        if (randomQueryType === 'single-random') {
            const randomKeyword = rankedKeywords[Math.floor(Math.random()*rankedKeywords.length)];
            return randomKeyword.text;

        } else if (randomQueryType === 'double-random') {
            const randomKeyword1 = rankedKeywords[Math.floor(Math.random()*rankedKeywords.length)];
            let randomKeyword2
            while((randomKeyword2 != randomKeyword1) && !randomKeyword2) {
                randomKeyword2 = rankedKeywords[Math.floor(Math.random()*rankedKeywords.length)];
            }
            return `${randomKeyword1.text} ${randomKeyword2.text}`;
        }
    } else {
        const queryType = queryTypes[Math.floor(Math.random()*queryTypes.length)];
        if (queryType === 'single-sorted') {
            return rankedKeywords[index].text;
        } else if (queryType === 'double-sorted') {
            const firstKeyword = rankedKeywords[index].text;
            const topRankedKeywords = rankedKeywords.slice(0, 20);
            let randomRankedKeyword;
            
             while((firstKeyword != randomRankedKeyword) && !randomRankedKeyword) {
                randomRankedKeyword = topRankedKeywords[Math.floor(Math.random()*topRankedKeywords.length)];
            }
            return `${firstKeyword} ${randomRankedKeyword.text}`;
        }
    }
}