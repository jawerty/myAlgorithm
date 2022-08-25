import { _LDA } from "./lda.js";

function rankKeywords(keywords, feedSettings) {
  return Object.keys(keywords)
    .map((keywordText) => {
      const keyword = keywords[keywordText]
      const searchQueryOccurrences = keyword.engagementTypes['search-query']
      const metaOccurrences =
        keyword.engagementTypes['meta-keywords'] +
        keyword.engagementTypes['meta-title']
      const clicksOccurrences =
        keyword.engagementTypes['link-click'] +
        keyword.engagementTypes['content-click']
      const generalInputOccurrences = keyword.engagementTypes['input-type']
      const customOccurrences = keyword.engagementTypes['custom']

      const score =
        feedSettings.priorities.metaInfo * metaOccurrences +
        feedSettings.priorities.searchQuery * searchQueryOccurrences +
        feedSettings.priorities.clicks * clicksOccurrences +
        feedSettings.priorities.generalInput * generalInputOccurrences +
        5 * customOccurrences // default to a lot

      keyword.score = score
      return keyword
    })
    .sort((a, b) => {
      return b.score - a.score
    })
}

function generateKeywordTopics(rankedKeywords, withProbabilities) {
  const maxKeywordScore = rankedKeywords[0].score
  const normalMax = 10
  const documents = rankedKeywords.map((keyword) => {
    const normalScore = (normalMax * keyword.score) / maxKeywordScore
    return `${keyword.text} `.repeat(Math.round(normalScore)).trim()
  })

  let topicCount
  let termCount = 3

  if (rankedKeywords.length <= 10) {
    topicCount = 3
    termCount = 1
  } else if (rankedKeywords.length <= 200) {
    topicCount = 5
    termCount = 2
  } else {
    topicCount = Math.round(rankedKeywords.length / 40)
    if (topicCount > 10) {
      topicCount = 10;
    }
  }

  const results = _LDA(documents, topicCount, termCount).sort((a, b) => {
    return b[0].probability - a[0].probability
  })
  if (withProbabilities) {
    return results
  } else {
    return results.map((result) => {
      return result[0].term
    })
  }
}

function buildSearchQuery(topics, rankedKeywords, index, random) {
  const queryTypes = ['single-sorted', 'double-sorted']
  const randomQueryTypes = ['single-random', 'double-random']
  console.log('random', random)
  if (random) {
    const randomQueryType =
      randomQueryTypes[Math.floor(Math.random() * randomQueryTypes.length)]
    if (randomQueryType === 'single-random') {
      const randomTopic =
        rankedKeywords[Math.floor(Math.random() * rankedKeywords.length)]
      return [randomTopic.text, [randomTopic.text]]
    } else if (randomQueryType === 'double-random') {
      const randomTopic1 =
        rankedKeywords[Math.floor(Math.random() * rankedKeywords.length)]
      let randomTopic2
      while (randomTopic2 != randomTopic1 && !randomTopic2) {
        randomTopic2 =
          rankedKeywords[Math.floor(Math.random() * rankedKeywords.length)]
      }
      return [`${randomTopic1.text} ${randomTopic2.text}`, [randomTopic1.text, randomTopic2.text]]
    }
  } else {
    const queryType = queryTypes[Math.floor(Math.random() * queryTypes.length)]
    if (queryType === 'single-sorted') {
      return [topics[index], [topics[index]]]
    } else if (queryType === 'double-sorted') {
      const firstKeyword = topics[index]
      let randomRankedKeyword

      while (firstKeyword != randomRankedKeyword && !randomRankedKeyword) {
        randomRankedKeyword = topics[Math.floor(Math.random() * topics.length)]
      }
      return [`${firstKeyword} ${randomRankedKeyword}`, [firstKeyword, randomRankedKeyword]]
    }
  }
}

export {
  rankKeywords,
  generateKeywordTopics,
  buildSearchQuery
}