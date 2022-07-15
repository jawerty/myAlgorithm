import "../styles/feed-settings.scss";
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import { useEffect, useState } from "react";

import contentBranding from "../contentBranding";

function FeedSettings() {
    const [metaInfo, setMetaInfo] = useState(1);
    const [searchQuery, setSearchQuery] = useState(1);
    const [linkClicks, setLinkClicks] = useState(1);
    const [generalInput, setGeneralInput] = useState(1);
    const [refreshMode, setRefreshMode] = useState(false);
    const [saved, setSaved] = useState(false);
    const [initFeedSettings, setInitFeedSettings] = useState(1);
    const [sourcingYoutube, setSourcingYoutube] = useState(false);
    const [sourcingTwitter, setSourcingTwitter] = useState(false);
    const [sourcingReddit, setSourcingReddit] = useState(false);
    const [sourcingQuora, setSourcingQuora] = useState(false);
    const [sourcingGab, setSourcingGab] = useState(false);
    const [sourcingBitchute, setSourcingBitchute] = useState(false);

    useEffect(() => {
        chrome.runtime.sendMessage({ 
            action: "getFeedSettings"
        }, (response) => {
            if (response.feedSettings) {
                setInitFeedSettings(response.feedSettings)
                setMetaInfo(response.feedSettings.priorities.metaInfo);
                setLinkClicks(response.feedSettings.priorities.clicks);
                setSearchQuery(response.feedSettings.priorities.searchQuery);
                setGeneralInput(response.feedSettings.priorities.generalInput);
                setRefreshMode(response.feedSettings.refreshMode);
                
                setSourcingYoutube(response.feedSettings.sourcing.youtube);
                setSourcingTwitter(response.feedSettings.sourcing.twitter);
                setSourcingReddit(response.feedSettings.sourcing.reddit);
                setSourcingQuora(response.feedSettings.sourcing.quora);
                setSourcingGab(response.feedSettings.sourcing.gab);
                setSourcingBitchute(response.feedSettings.sourcing.bitchute);
            }
        });
    }, []);

    useEffect(() => {
        if (saved) {
            setTimeout(() => {
                setSaved(false)
            }, 2000)
        }
    }, [saved]);

    const saveSettings = () => {
        const newFeedSettings = {...initFeedSettings};
        newFeedSettings.priorities.metaInfo = metaInfo;
        newFeedSettings.priorities.clicks = linkClicks;
        newFeedSettings.priorities.searchQuery = searchQuery;
        newFeedSettings.priorities.generalInput = generalInput;

        newFeedSettings.refreshMode = refreshMode;

        newFeedSettings.sourcing.youtube = sourcingYoutube;
        newFeedSettings.sourcing.twitter = sourcingTwitter;
        newFeedSettings.sourcing.reddit = sourcingReddit;
        newFeedSettings.sourcing.quora = sourcingQuora;
        newFeedSettings.sourcing.gab = sourcingGab;
        newFeedSettings.sourcing.bitchute = sourcingBitchute;

        chrome.runtime.sendMessage({ 
            action: "saveFeedSettings",
            newFeedSettings
        }, () => {
            setSaved(true)
        });
    }

    
    return <div className="feed-settings flex flex-column">
        <label className="feed-settings__group-label">
            Content Sourcing
        </label>
        <span className="feed-settings__hint">What platforms do you want to get content from?</span>
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
        <div className="feed-settings__seperator"></div>
        <label className="feed-settings__group-label">
            Ranking Priorities
        </label>
        <div className="feed-settings__row flex align-center justify-between">
            <span className="feed-settings__row-label">Meta Details</span>
            <Slider
                value={metaInfo}
                step={1}
                marks
                onChange={(event, newValue) => {
                    setMetaInfo(newValue);
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
                    setSearchQuery(newValue);
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
                    setLinkClicks(newValue);
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
                    setGeneralInput(newValue);
                }}
                min={1}
                max={5}
                valueLabelDisplay="auto"
            />
        </div>
        <div className="feed-settings__seperator"></div>
        <label className="feed-settings__group-label">
            General Settings
        </label>
        <div className="feed-settings__row flex align-center justify-between">
            <span className="feed-settings__row-label">Enable Refresh (for Today's Feed)</span>
            <Switch
                checked={refreshMode}
                onChange={(event) => {
                    setRefreshMode(event.target.checked)
                }}
            />
        </div>
        <div className="feed-settings__seperator"></div>

        <div className="flex align-center">
            <div className="feed-settings__save-button" onClick={saveSettings}>Save</div>
            {saved && <span className="feed-settings__saved-complete">Saved!</span>}
        </div>
    </div>
}

export default FeedSettings;