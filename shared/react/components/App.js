import { useState } from 'react'
import ContentFeed from './ContentFeed'
import Footer from './Footer'
import Header from './Header'
import FeedSettings from './FeedSettings'
import AlgorithmEditor from './AlgorithmEditor'

function App() {
  const [currentPage, setCurrentPage] = useState('view-feed')
  return (
    <div className="app">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'view-feed' && <ContentFeed />}
      {currentPage === 'algorithm-editor' && <AlgorithmEditor />}
      {currentPage === 'feed-settings' && <FeedSettings />}
      <Footer />
    </div>
  )
}

export default App
