import '../styles/feed-settings.scss'
import Slider from '@mui/material/Slider'
import Switch from '@mui/material/Switch'
import { useEffect, useState } from 'react'

import { fetchContentSourceDetails } from '../../content-fetcher'

import contentBranding from '../contentBranding'

function FeedSettings() {
  const [metaInfo, setMetaInfo] = useState(1)
  const [searchQuery, setSearchQuery] = useState(1)
  const [linkClicks, setLinkClicks] = useState(1)
  const [generalInput, setGeneralInput] = useState(1)
  const [refreshMode, setRefreshMode] = useState(false)
  const [offMode, setOffMode] = useState(false)
  const [saved, setSaved] = useState(false)
  const [initFeedSettings, setInitFeedSettings] = useState(1)
  const [sourcingYoutube, setSourcingYoutube] = useState(false)
  const [sourcingTwitter, setSourcingTwitter] = useState(false)
  const [sourcingReddit, setSourcingReddit] = useState(false)
  const [sourcingQuora, setSourcingQuora] = useState(false)
  const [sourcingWikipedia, setSourcingWikipedia] = useState(false)
  const [sourcingOdysee, setSourcingOdysee] = useState(false)
  const [sourcingStackoverflow, setSourcingStackoverflow] = useState(false)
  const [sourcingGab, setSourcingGab] = useState(false)
  const [sourcingBitchute, setSourcingBitchute] = useState(false)
  const [showCustomSourceForm, setShowCustomSourceForm] = useState(false)
  const [customSourceText, setCustomSourceText] = useState()
  const [customSourceFormError, setCustomSourceFormError] = useState(false)
  const [savedSource, setSavedSource] = useState(false)
  const [loadingNewSource, setLoadingNewSource] = useState(false)
  const [customSources, setCustomSources] = useState()

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        action: 'getCustomSources',
      },
      (response) => {
        console.log(Object.values(response.customSources))
        setCustomSources(response.customSources)
      }
    )
  }, [])

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        action: 'getFeedSettings',
      },
      (response) => {
        if (response.feedSettings) {
          setInitFeedSettings(response.feedSettings)
          setMetaInfo(response.feedSettings.priorities.metaInfo)
          setLinkClicks(response.feedSettings.priorities.clicks)
          setSearchQuery(response.feedSettings.priorities.searchQuery)
          setGeneralInput(response.feedSettings.priorities.generalInput)
          setRefreshMode(response.feedSettings.refreshMode)
          setOffMode(response.feedSettings.disableAlgorithm)

          setSourcingYoutube(response.feedSettings.sourcing.youtube)
          setSourcingTwitter(response.feedSettings.sourcing.twitter)
          setSourcingReddit(response.feedSettings.sourcing.reddit)
          setSourcingQuora(response.feedSettings.sourcing.quora)
          setSourcingWikipedia(response.feedSettings.sourcing.wikipedia)
          setSourcingOdysee(response.feedSettings.sourcing.odysee)
          setSourcingStackoverflow(response.feedSettings.sourcing.stackoverflow)
          setSourcingGab(response.feedSettings.sourcing.gab)
          setSourcingBitchute(response.feedSettings.sourcing.bitchute)
        }
      }
    )
  }, [])

  useEffect(() => {
    if (saved) {
      setTimeout(() => {
        setSaved(false)
      }, 2000)
    }
  }, [saved])

  useEffect(() => {
    if (savedSource) {
      setTimeout(() => {
        setSavedSource(false)
      }, 2000)
    }
  }, [savedSource])

  const saveSettings = () => {
    const newFeedSettings = { ...initFeedSettings }
    newFeedSettings.priorities.metaInfo = metaInfo
    newFeedSettings.priorities.clicks = linkClicks
    newFeedSettings.priorities.searchQuery = searchQuery
    newFeedSettings.priorities.generalInput = generalInput

    newFeedSettings.refreshMode = refreshMode
    newFeedSettings.disableAlgorithm = offMode

    newFeedSettings.sourcing.youtube = sourcingYoutube
    newFeedSettings.sourcing.twitter = sourcingTwitter
    newFeedSettings.sourcing.reddit = sourcingReddit
    newFeedSettings.sourcing.quora = sourcingQuora
    newFeedSettings.sourcing.wikipedia = sourcingWikipedia
    newFeedSettings.sourcing.odysee = sourcingOdysee
    newFeedSettings.sourcing.stackoverflow = sourcingStackoverflow
    newFeedSettings.sourcing.gab = sourcingGab
    newFeedSettings.sourcing.bitchute = sourcingBitchute

    for (let customSource of Object.values(customSources)) {
      chrome.runtime.sendMessage({
        action: 'editCustomSource',
        customSourceDomain: customSource.domain,
        enabled: customSource.checked,
      })
    }

    chrome.runtime.sendMessage(
      {
        action: 'saveFeedSettings',
        newFeedSettings,
      },
      () => {
        setSaved(true)
      }
    )
  }

  const addCustomSource = async () => {
    setCustomSourceFormError(null)
    setLoadingNewSource(true)
    console.log('customSourceText', customSourceText)
    let customSourceTextTemp = customSourceText

    if (!customSourceText || customSourceText.length === 0) {
      setCustomSourceFormError('You must enter a proper domain')
      setLoadingNewSource(false)
      return
    }

    if (customSourceText.split('.').length < 2) {
      setCustomSourceFormError('You must enter a proper domain')
      setLoadingNewSource(false)
      return
    }

    if (
      customSourceTextTemp.indexOf('http://') !== 0 ||
      customSourceTextTemp.indexOf('https://') !== 0
    ) {
      customSourceTextTemp = `http://${customSourceTextTemp}`
    }

    try {
      const url = new URL(customSourceTextTemp)
      if (!url.hostname || url.hostname.length === 0) {
        setCustomSourceFormError('You must enter a proper domain')
        setLoadingNewSource(false)

        return
      }
    } catch (e) {
      console.log(e)
      setCustomSourceFormError('You must enter a proper domain')
      setLoadingNewSource(false)

      return
    }

    let contentSourceDetails
    try {
      contentSourceDetails = await fetchContentSourceDetails(
        customSourceTextTemp,
        customSourceText
      )
    } catch (e) {
      console.log(e)
      setCustomSourceFormError('Could not add Content Source try again')
      setLoadingNewSource(false)
      return
    }

    if (contentSourceDetails && contentSourceDetails.name) {
      chrome.runtime.sendMessage(
        {
          action: 'addCustomSource',
          customSourceData: {
            domain: customSourceText,
            sourceName: contentSourceDetails.name,
            image: contentSourceDetails.image,
            checked: false,
          },
        },
        () => {
          setSavedSource(true)
          setLoadingNewSource(false)
        }
      )
    } else {
      setCustomSourceFormError('Could not add Content Source try again')
      setLoadingNewSource(false)
      return
    }
  }

  const checkCustomSource = (checked, customSourceToCheck) => {
    const customSourcesCopy = { ...customSources }
    customSourcesCopy[customSourceToCheck.domain].checked = checked
    setCustomSources(customSourcesCopy)
  }

  return (
    <div className="feed-settings flex flex-column">
      <label className="feed-settings__group-label">Content Sourcing</label>
      <span className="feed-settings__hint">
        What platforms do you want to get content from?
      </span>
      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label flex align-start justify-start">
          {contentBranding['youtube.com'].image}
        </span>
        <Switch
          checked={sourcingYoutube}
          onChange={(event) => {
            setSourcingYoutube(event.target.checked)
          }}
        />
      </div>
      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label flex align-start">
          {contentBranding['twitter.com'].image}
          &nbsp;Twitter
        </span>
        <Switch
          checked={sourcingTwitter}
          onChange={(event) => {
            setSourcingTwitter(event.target.checked)
          }}
        />
      </div>
      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label flex align-start">
          {contentBranding['reddit.com'].image}
        </span>
        <Switch
          checked={sourcingReddit}
          onChange={(event) => {
            setSourcingReddit(event.target.checked)
          }}
        />
      </div>
      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label flex align-start">
          {contentBranding['quora.com'].image}
        </span>
        <Switch
          checked={sourcingQuora}
          onChange={(event) => {
            setSourcingQuora(event.target.checked)
          }}
        />
      </div>
      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label flex align-center">
          <img src={contentBranding['wikipedia.com'].image} />
          &nbsp;Wikipedia
        </span>
        <Switch
          checked={sourcingWikipedia}
          onChange={(event) => {
            setSourcingWikipedia(event.target.checked)
          }}
        />
      </div>
      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label flex align-center">
          {contentBranding['odysee.com'].image} &nbsp;Odysee
        </span>
        <Switch
          checked={sourcingOdysee}
          onChange={(event) => {
            setSourcingOdysee(event.target.checked)
          }}
        />
      </div>

      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label flex align-start">
          {contentBranding['stackoverflow.com'].image}
        </span>
        <Switch
          checked={sourcingStackoverflow}
          onChange={(event) => {
            setSourcingStackoverflow(event.target.checked)
          }}
        />
      </div>
      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label flex align-start">
          {contentBranding['gab.com'].image}
        </span>
        <Switch
          checked={sourcingGab}
          onChange={(event) => {
            setSourcingGab(event.target.checked)
          }}
        />
      </div>
      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label flex align-start">
          {contentBranding['bitchute.com'].image}
        </span>
        <Switch
          checked={sourcingBitchute}
          onChange={(event) => {
            setSourcingBitchute(event.target.checked)
          }}
        />
      </div>

      {customSources &&
        Object.keys(customSources).length > 0 &&
        Object.values(customSources).map((customSource) => {
          return (
            <div className="feed-settings__row flex align-center justify-between">
              <span className="feed-settings__row-label flex align-center">
                <span
                  onClick={() => {
                    chrome.runtime.sendMessage(
                      {
                        action: 'removeCustomSource',
                        customSourceDomain: customSource.domain,
                      },
                      () => {
                        setTimeout(() => {
                          chrome.runtime.sendMessage(
                            {
                              action: 'getCustomSources',
                            },
                            (response) => {
                              setCustomSources(response.customSources)
                            }
                          )
                        }, 500)
                      }
                    )
                  }}
                  className="feed-settings__remove"
                >
                  X
                </span>
                {customSource.image && (
                  <img
                    style={{ marginRight: '5px' }}
                    src={customSource.image}
                  />
                )}
                <strong>{customSource.sourceName}&nbsp;</strong>
                {customSource.sourceName !== customSource.domain
                  ? ` (${customSource.domain})`
                  : ''}
              </span>
              <Switch
                checked={customSource.checked}
                onChange={(event) => {
                  checkCustomSource(event.target.checked, customSource)
                }}
              />
            </div>
          )
        })}
      <div className="feed-settings__row flex align-center">
        {!showCustomSourceForm && (
          <div
            className="feed-settings__show-form-btn mr-1"
            onClick={() => {
              setShowCustomSourceForm(true)
            }}
          >
            Add a Custom Source
          </div>
        )}
        {showCustomSourceForm && (
          <div className="feed-settings__custom-source-form flex flex-column">
            {customSourceFormError && (
              <p className="error-text">{customSourceFormError}</p>
            )}
            <div className="flex align-center">
              <input
                type="text"
                className="feed-settings__form-text-input"
                placeholder="Enter a Domain (e.g. goodreads.com)"
                value={customSourceText}
                onChange={(e) => setCustomSourceText(e.target.value)}
              />
              <div className="flex flex-column align-center">
                <div
                  className={`feed-settings__submit-form-btn mr-1${
                    loadingNewSource ? ' disabled' : ''
                  }`}
                  onClick={async () => {
                    try {
                      await addCustomSource()
                      setTimeout(() => {
                        chrome.runtime.sendMessage(
                          {
                            action: 'getCustomSources',
                          },
                          (response) => {
                            setCustomSources(response.customSources)
                          }
                        )
                      }, 500)
                    } catch (e) {
                      setCustomSourceFormError(
                        'Could not add Content Source try another domain'
                      )
                      setLoadingNewSource(false)
                    }
                  }}
                >
                  Add Custom Source
                </div>
                {savedSource && (
                  <span className="feed-settings__saved-complete">Saved!</span>
                )}
                {loadingNewSource && (
                  <span className="feed-settings__loading">Loading...</span>
                )}
              </div>
            </div>
            <span className="feed-settings__hint">
              Regex Patterns are allowed (goodreads.com/*/)
            </span>
          </div>
        )}
      </div>
      <div className="feed-settings__seperator"></div>
      <label className="feed-settings__group-label">Ranking Priorities</label>
      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label">Meta Details</span>
        <Slider
          value={metaInfo}
          step={1}
          marks
          onChange={(event, newValue) => {
            setMetaInfo(newValue)
          }}
          min={1}
          max={5}
          valueLabelDisplay="auto"
        />
      </div>
      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label">Search Queries</span>
        <Slider
          value={searchQuery}
          step={1}
          marks
          onChange={(event, newValue) => {
            setSearchQuery(newValue)
          }}
          min={1}
          max={5}
          valueLabelDisplay="auto"
        />
      </div>
      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label">Link Clicks</span>
        <Slider
          value={linkClicks}
          step={1}
          marks
          onChange={(event, newValue) => {
            setLinkClicks(newValue)
          }}
          min={1}
          max={5}
          valueLabelDisplay="auto"
        />
      </div>
      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label">General Input</span>
        <Slider
          value={generalInput}
          step={1}
          marks
          onChange={(event, newValue) => {
            setGeneralInput(newValue)
          }}
          min={1}
          max={5}
          valueLabelDisplay="auto"
        />
      </div>
      <div className="feed-settings__seperator"></div>
      <label className="feed-settings__group-label">General Settings</label>
      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label">
          Enable Refresh (for Today's Feed)
        </span>
        <Switch
          checked={refreshMode}
          onChange={(event) => {
            setRefreshMode(event.target.checked)
          }}
        />
      </div>
      <div className="feed-settings__row flex align-center justify-between">
        <span className="feed-settings__row-label">
          Turn off myAlgorithm (<strong>no data will be collected</strong>)
        </span>
        <Switch
          checked={offMode}
          onChange={(event) => {
            setOffMode(event.target.checked)
          }}
        />
      </div>
      <div className="feed-settings__seperator mt-1"></div>

      <div className="flex align-center">
        <div className="feed-settings__save-button" onClick={saveSettings}>
          Save
        </div>
        {saved && <span className="feed-settings__saved-complete">Saved!</span>}
      </div>
    </div>
  )
}

export default FeedSettings
