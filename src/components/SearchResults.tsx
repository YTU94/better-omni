import type { SearchResult, TabInfo, BookmarkInfo } from '../types'
import { unknowImgUrl } from '@/assets/index'

interface SearchResultsProps {
  results: SearchResult[]
  selectedIndex: number
  onSelectResult: (result: SearchResult) => void
  onCloseTab?: (tabId: number) => void
  query: string
}

export function SearchResults({ results, selectedIndex, onSelectResult, onCloseTab, query }: SearchResultsProps) {
  if (query.trim() && results.length === 0) {
    return (
      <div className="search-results">
        <div className="no-results">
          No results found for "{query}"
        </div>
      </div>
    )
  }

  if (results.length === 0 && !query.trim()) {
    return (
      <div className="search-results">
        <div className="welcome-message">
          <h3>Quick Tab Launcher</h3>
          <p>Type to search tabs and bookmarks</p>
          <div className="shortcuts">
            <div>↓↑ Navigate</div>
            <div>↵ Select</div>
            <div>Esc Close</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="search-results">
      {results.map((result, index) => (
        <SearchResultItem
          key={`${result.type}-${result.data.id}`}
          result={result}
          isSelected={index === selectedIndex}
          onClick={() => onSelectResult(result)}
          onCloseTab={onCloseTab}
          query={query}
        />
      ))}
    </div>
  )
}

interface SearchResultItemProps {
  result: SearchResult
  isSelected: boolean
  onClick: () => void
  onCloseTab?: (tabId: number) => void
  query: string
}

function SearchResultItem({ result, isSelected, onClick, onCloseTab, query }: SearchResultItemProps) {
  const getIcon = (result: SearchResult) => {
    if (result.type === 'tab') {
      const tab = result.data as TabInfo
      return tab.favIconUrl || unknowImgUrl
    } else {
      const bookmark = result.data as BookmarkInfo
      return bookmark.favIconUrl || unknowImgUrl
    }
  }

  const getTitle = (result: SearchResult) => {
    const data = result.data
    return 'title' in data ? data.title : 'Untitled'
  }

  const getUrl = (result: SearchResult) => {
    const data = result.data
    return 'url' in data ? data.url : ''
  }

  const getTypeLabel = (result: SearchResult) => {
    return result.type === 'tab' ? 'Tab' : 'Bookmark'
  }

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (result.type === 'tab' && onCloseTab) {
      const tab = result.data as TabInfo
      onCloseTab(tab.id)
    }
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  return (
    <div
      className={`search-result-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="result-icon">
        <img src={getIcon(result)} alt="" />
      </div>
      <div className="result-content">
        <div 
          className="result-title"
          dangerouslySetInnerHTML={{ __html: highlightMatch(getTitle(result), query) }}
        />
        <div className="result-url">{getUrl(result)}</div>
      </div>
      <div className="result-type">{getTypeLabel(result)}</div>
      {result.type === 'tab' && onCloseTab && (
        <button 
          className="close-tab-button"
          onClick={handleCloseClick}
          title="Close tab"
          aria-label="Close tab"
        >
          ×
        </button>
      )}
    </div>
  )
}