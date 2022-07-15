import { useState } from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import "../styles/topic-editor.scss";

function TopicEditor({ getKeywords, keywords, setKeywords }) {
    const [showAddTopicForm, setShowAddTopicForm] = useState(false);
    const [newTopic, setNewTopic] = useState();
    const [showCount, setShowCount] = useState(50);
    const TopicTooltip = styled(({ className, ...props }) => (
        <Tooltip
          {...props}
          enterTouchDelay={0}
          arrow
          classes={{ popper: className }}
        />
      ))(({ }) => ({
        [`& .${tooltipClasses.arrow}`]: {
          color: "#000000",
        },
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: "#000000",
          fontFamily: "Roobert",
          fontSize: "12px",
          borderRadius: "6px",
          padding: "8px 10px",
        },
    }));


    const removeKeyword = (keywordText, index) => {
        chrome.runtime.sendMessage({ 
            action: "removeKeyword",
            keyword: keywordText
        }, () => {
            const newKeywords = [...keywords];
            newKeywords.splice(index, 1);
            setKeywords(newKeywords);
        });
    }

    const addTopic = () => {
        if (newTopic.length === 0) {
            alert("Your topic must not be empty"); 
        } else {
            chrome.runtime.sendMessage({ 
                action: "addTopic",
                keyword: newTopic
            }, () => {
                setTimeout(() => {
                    getKeywords();
                }, 500)
            });
        }
    }
    return <div className="topic-editor flex flex-column align-start">
        <div className="topic-editor flex flex-column align-start justify-start">
            <span className="mb-1 topic-editor__title">Edit your algorithm: (topics are generated from your browsing habits)</span>
            
            {keywords && keywords.length > 0 && <div className="topic-editor flex flex-wrap align-center">
                {keywords.slice(0, showCount).map((keyword, i) => {
                    return (
                        <TopicTooltip
                        placement="top"
                        arrow
                        title={<span dangerouslySetInnerHTML={{__html: `
                            Occurences Breakdown: <br />
                            Search Queries = ${keyword.engagementTypes['search-query']} <br />
                            Meta Keywords = ${keyword.engagementTypes['meta-keywords']} <br />
                            Meta Titles = ${keyword.engagementTypes['meta-title']} <br />
                            Link Clicks = ${keyword.engagementTypes['link-click']} <br />
                            General Input = ${keyword.engagementTypes['input-type']} <br />
                            Custom = ${keyword.engagementTypes['custom']} <br />
                            Total = ${keyword.occurrences}
                        `}}></span>}>
                            <div className="topic-editor__topic-tag flex align-center">{keyword.text} <span className="topic-editor_x" onClick={() => removeKeyword(keyword.text, i)}>X</span></div>
                        </TopicTooltip>
                    )
                })}
                {showCount < keywords.length && <label 
                    className="topic-editor__show-more-label"
                    onClick={() => setShowCount(showCount + 25)}>
                    Show More
                </label>}
                
            </div>}
            {!keywords || keywords.length === 0 && <div className="mt-1">No data yet :( start browsing and build up your algorithm</div>}

            <div className={`flex${showAddTopicForm ? ' flex-column' : ''} align-start`}>
                {keywords && keywords.length > 0 && <div className="topic-editor__reset-btn mr-1" onClick={() => {
                    chrome.runtime.sendMessage({ 
                        action: "clearKeywords"
                    }, () => {
                        setTimeout(() => {
                            getKeywords();
                        }, 500)
                    });
                }}>Reset Algorithm</div>}
                {!showAddTopicForm && <label 
                    className="topic-editor__add-topic-btn"
                    onClick={() => setShowAddTopicForm(true)}>
                    Add a Custom Topic
                </label>}
                {showAddTopicForm && <div className="topic-editor__add-topic-form flex align-center">
                    <input 
                        value={newTopic}
                        onChange={(e) => {
                            setNewTopic(e.target.value);
                        }}
                        className="topic-editor__add-topic-text"
                        type="text"
                        placeholder="Topic name (e.g. your favorite car name)"
                    />
                    <div className="topic-editor__add-topic-submit" onClick={() => addTopic()}>Add Topic</div>
                </div>}
            </div>
            
        </div>
       
    </div>
}

export default TopicEditor;