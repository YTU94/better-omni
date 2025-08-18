import type { SearchResult, TabInfo, BookmarkInfo } from '../types'

interface SearchResultsProps {
  results: SearchResult[]
  selectedIndex: number
  onSelectResult: (result: SearchResult) => void
  query: string
}

export function SearchResults({ results, selectedIndex, onSelectResult, query }: SearchResultsProps) {
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
  query: string
}

function SearchResultItem({ result, isSelected, onClick, query }: SearchResultItemProps) {
  const getIcon = (result: SearchResult) => {
    if (result.type === 'tab') {
      const tab = result.data as TabInfo
      return tab.favIconUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMTZDMTEuMzEzNyAxNiAxNCAxMy4zMTM3IDE0IDEwQzE0IDYuNjg2MjkgMTEuMzEzNyA0IDggNEM0LjY4NjI5IDQgMiA2LjY4NjI5IDIgMTBDMiAxMy4zMTM3IDQuNjg2MjkgMTYgOCAxNloiIGZpbGw9IiM2NjY2NjYiLz4KPC9zdmc+'
    } else {
      const bookmark = result.data as BookmarkInfo
      return bookmark.favIconUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDRIMTBDMTAgMi45IDEwLjkgMiAxMiAySDE0QzE0LjYgMiAxNSAyLjQgMTUgM1YxM0MxNSAxMy42IDE0LjYgMTQgMTQgMTRIMTJDMTEuNCAxNCAxMSAxMy42IDExIDEzVjRIMTJ6TTQgMTJIMlY0SDRWMTJ6TTggMTJINlY0SDhWMTJ6IiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPg=='
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
    </div>
  )
}