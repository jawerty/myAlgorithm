import '../styles/header.scss'

function Header({ currentPage, setCurrentPage }) {
  return (
    <div className="header flex flex-column">
      <div className="header__title-area flex align-center justify-between">
        <h1 className="header__title">myAlgorithm</h1>
        <div className="flex align-center justify-center">
          <a target="_blank" href="https://github.com/jawerty/myalgorithm">
            About
          </a>{' '}
          <a target="_blank" href="mailto:jawerty210@gmail.com">
            Found a bug?
          </a>
        </div>
      </div>
      <div className="justify-between flex full-width">
        <div
          className={`header__option${
            currentPage === 'view-feed' ? ' active' : ''
          }`}
          onClick={() => setCurrentPage('view-feed')}
        >
          Today's Feed
        </div>
        <div
          className={`header__option${
            currentPage === 'algorithm-editor' ? ' active' : ''
          }`}
          onClick={() => setCurrentPage('algorithm-editor')}
        >
          Algorithm Editor
        </div>
        <div
          className={`header__option${
            currentPage === 'feed-settings' ? ' active' : ''
          }`}
          onClick={() => setCurrentPage('feed-settings')}
        >
          Feed Settings
        </div>
      </div>
    </div>
  )
}

export default Header
