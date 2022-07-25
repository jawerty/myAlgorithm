const API = chrome || browser;

const storage = {
  KEYS: {
    keywords: 'myalgorithm_keywords',
    feed_settings: 'myalgorithm_feed_settings',
    fetched_ts: 'myalgorithm_fetched_ts',
    content_feed: 'myalgorithm_content_feed',
    custom_sources: 'myalgorithm_custom_sources',
  },
  save: (key, value) => {
    return new Promise((resolve) => {
      const data = {}
      data[key] = JSON.stringify(value)
      API.storage.local.set(data, function () {
        resolve(true)
      })
    })
  },
  get: (key) => {
    return new Promise((resolve) => {
      API.storage.local.get([key], function (result) {
        try {
          resolve(JSON.parse(result[key]))
        } catch (e) {
          resolve({})
        }
      })
    })
  },
}

function ContentItem(contentInfo) {
  this.title = contentInfo.title
  this.description = contentInfo.description
  this.image = contentInfo.image
  this.link = contentInfo.link
  this.source = contentInfo.source
}

function ContentFeed(contentItems) {
  this.contentItems = contentItems
}

function Keyword(pastKeywordObject, newEngagementType, sourceDomain) {
  this.text = pastKeywordObject.text
  this.occurrences = pastKeywordObject.occurrences + 1
  this.engagementTypes = pastKeywordObject.engagementTypes
  this.engagementTypes[newEngagementType] += 1
  this.history = pastKeywordObject.history
  if (sourceDomain) {
    if (sourceDomain in this.history) {
      this.history[sourceDomain] += 1
    } else {
      this.history[sourceDomain] = 1
    }
  }

  this.lastInteractionTs = Date.now()
}

function FeedSettings(pastFeedSettings, newOption) {
  this.defaultPriorities = {
    metaInfo: 3,
    searchQuery: 5,
    clicks: 2,
    generalInput: 4,
  }

  this.defaultSourcing = {
    youtube: true,
    twitter: true,
    reddit: true,
    quora: true,
    wikipedia: true,
    odysee: true,
    stackoverflow: true,
    gab: true,
    bitchute: true,
  }

  if (!pastFeedSettings.priorities) {
    this.priorities = this.defaultPriorities
  } else {
    for (let defaultKey of Object.keys(this.defaultPriorities)) {
      if (typeof pastFeedSettings.priorities[defaultKey] === 'undefined') {
        pastFeedSettings.priorities[defaultKey] =
          this.defaultPriorities[defaultKey]
      }
    }
    this.priorities = pastFeedSettings.priorities
  }

  if (!pastFeedSettings.sourcing) {
    this.sourcing = this.defaultSourcing
  } else {
    for (let defaultKey of Object.keys(this.defaultSourcing)) {
      if (typeof pastFeedSettings.sourcing[defaultKey] === 'undefined') {
        pastFeedSettings.sourcing[defaultKey] = this.defaultSourcing[defaultKey]
      }
    }
    this.sourcing = pastFeedSettings.sourcing
  }

  this.oppositeMode = pastFeedSettings.oppositeMode || false
  this.refreshMode = pastFeedSettings.refreshMode || false
  this.randomness = pastFeedSettings.randomness || 0
  this.disableAlgorithm = pastFeedSettings.disableAlgorithm || false

  if (newOption) {
    Object.assign(this, newOption)
  }
}

export {
  storage,
  FeedSettings,
  Keyword,
  ContentFeed,
  ContentItem
} 
