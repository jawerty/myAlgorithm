import { useEffect, useState } from 'react'
import '../styles/algorithm-editor.scss'
import TopicEditor from './TopicEditor'
import DomainGraph from './DomainGraph'
import TopicGraph from './TopicGraph'

function AlgorithmEditor() {
  const [keywords, setKeywords] = useState([])

  const API = chrome || browser;
  const getKeywords = () => {
    API.runtime.sendMessage(
      {
        action: 'getKeywords',
      },
      (response) => {
        console.log('response.keywords', response.keywords)

        if (response.keywords) {
          setKeywords(
            response.keywords.sort((a, b) => {
              return b.occurrences - a.occurrences
            })
          )
        } else {
          setKeywords([])
        }
      }
    )
  }

  useEffect(() => {
    getKeywords()
  }, [])

  return (
    <div className="algorithm-editor flex flex-column align-center justify-center">
      <h2 className="algorithm-editor__title">Engagement Overview</h2>
      <div className="algorithm-editor__graphs flex full-width align-center justify-between">
        <DomainGraph keywords={keywords} />
        <TopicGraph keywords={keywords} />
      </div>
      <TopicEditor
        keywords={keywords}
        getKeywords={getKeywords}
        setKeywords={setKeywords}
      />
    </div>
  )
}

export default AlgorithmEditor
