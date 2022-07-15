import "../styles/header.scss";

function Header({ currentPage, setCurrentPage }) {
    return <div className="header justify-between flex">
        <div className={`header__option${currentPage === 'view-feed' ? ' active' : ''}`}
            onClick={() => setCurrentPage('view-feed')}>
            Today's Feed
        </div>
        <div className={`header__option${currentPage === 'algorithm-editor' ? ' active' : ''}`}
            onClick={() => setCurrentPage('algorithm-editor')}>

            Algorithm Editor
        </div>
        <div className={`header__option${currentPage === 'feed-settings' ? ' active' : ''}`}
            onClick={() => setCurrentPage('feed-settings')}>
            Feed Settings
        </div>
        
    </div>
}

export default Header;