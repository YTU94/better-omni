import type { SearchResult, TabInfo, BookmarkInfo } from '../types'
import { unknowImgUrl } from '@/assets/index'
import { useMemo } from 'react'

interface SearchResultsProps {
  results: SearchResult[]
  selectedIndex: number
  onSelectResult: (result: SearchResult) => void
  onCloseTab?: (tabId: number) => void
  onCloseMultipleTabs?: (tabIds: number[]) => void
  onToggleBookmark?: (result: SearchResult) => void
  isBookmarked?: (result: SearchResult) => boolean
  query: string
}

export function SearchResults({
  results,
  selectedIndex,
  onSelectResult,
  onCloseTab,
  onCloseMultipleTabs,
  onToggleBookmark,
  isBookmarked,
  query
}: SearchResultsProps) {
  // Detect duplicate tabs based on URL
  const duplicateTabs = useMemo(() => {
    const tabResults = results.filter(r => r.type === 'tab') as Array<{ type: 'tab', data: TabInfo }>
    const urlMap = new Map<string, number[]>()

    tabResults.forEach(result => {
      const url = result.data.url
      if (urlMap.has(url)) {
        urlMap.get(url)!.push(result.data.id)
      } else {
        urlMap.set(url, [result.data.id])
      }
    })

    // Filter to only get URLs with duplicates (keeping the first one, removing others)
    const duplicates: number[] = []
    urlMap.forEach(tabIds => {
      if (tabIds.length > 1) {
        // Keep the first tab, close the rest
        duplicates.push(...tabIds.slice(1))
      }
    })

    return duplicates
  }, [results])

  if (query.trim() && results.length === 0) {
    return (
      <div className="search-results">
        <div className="no-results">
          No results found for "{query}"
        </div>
      </div>
    )
  }

  const handleDeleteDuplicates = () => {
    if (onCloseMultipleTabs && duplicateTabs.length > 0) {
      onCloseMultipleTabs(duplicateTabs)
    }
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
    <div className={`search-results-container ${duplicateTabs.length > 0 ? 'has-action-bar' : ''}`}>
      <div className="search-results">
        {results.map((result, index) => (
          <SearchResultItem
            key={`${result.type}-${result.data.id}`}
            result={result}
            isSelected={index === selectedIndex}
            onClick={() => onSelectResult(result)}
            onCloseTab={onCloseTab}
            onToggleBookmark={onToggleBookmark}
            isBookmarked={isBookmarked?.(result) ?? result.type === 'bookmark'}
            query={query}
          />
        ))}
      </div>

      {duplicateTabs.length > 0 && (
        <div className="action-bar">
          <div className="action-info">
            发现 {duplicateTabs.length} 个重复标签页
          </div>
          <button
            className="action-button"
            onClick={handleDeleteDuplicates}
            title="一键删除所有重复的Chrome标签页"
          >
            删除重复标签
          </button>
        </div>
      )}
    </div>
  )
}

interface SearchResultItemProps {
  result: SearchResult
  isSelected: boolean
  onClick: () => void
  onCloseTab?: (tabId: number) => void
  onToggleBookmark?: (result: SearchResult) => void
  isBookmarked: boolean
  query: string
}

function SearchResultItem({
  result,
  isSelected,
  onClick,
  onCloseTab,
  onToggleBookmark,
  isBookmarked,
  query
}: SearchResultItemProps) {
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

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleBookmark?.(result)
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
      {onToggleBookmark && (
        <button
          className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmarkClick}
          title={isBookmarked ? '删除书签' : '添加书签'}
          aria-label={isBookmarked ? '删除书签' : '添加书签'}
          aria-pressed={isBookmarked}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="bookmark-icon"
          >
            <path d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75v17.06a.75.75 0 0 1-1.18.61L12 18.06l-4.82 3.36A.75.75 0 0 1 6 20.81V3.75Z" />
          </svg>
        </button>
      )}
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
