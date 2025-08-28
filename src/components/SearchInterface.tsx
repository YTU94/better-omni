import { useState, useEffect, useRef, useCallback } from 'react'
import { chromeService } from '../services/chromeService'
import { searchEngine } from '../utils/search'
import type { SearchResult, TabInfo, BookmarkInfo } from '../types'
import { SearchInput } from './SearchInput'
import { SearchResults } from './SearchResults'

export function SearchInterface() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [tabs, setTabs] = useState<TabInfo[]>([])
  const [bookmarks, setBookmarks] = useState<BookmarkInfo[]>([])
  
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    performSearch()
  }, [query, tabs, bookmarks])

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      const [loadedTabs, loadedBookmarks] = await Promise.all([
        chromeService.getAllTabs(),
        chromeService.getAllBookmarks()
      ])
      setTabs(loadedTabs)
      console.log("309595 ~ loadInitialData ~ loadedTabs:", loadedTabs);
      setBookmarks(loadedBookmarks)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const performSearch = useCallback(() => {
    if (!query.trim()) {
      const tabResults = searchEngine.searchTabs(tabs, '')
      setResults(tabResults)
    } else {
      const tabResults = searchEngine.searchTabs(tabs, query)
      const bookmarkResults = searchEngine.searchBookmarks(bookmarks, query)
      setResults([...tabResults, ...bookmarkResults])
    }
    setSelectedIndex(0)
  }, [query, tabs, bookmarks])

  const handleKeyDown = useCallback(async (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex(prev => (prev + 1) % Math.max(results.length, 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(results.length, 1))
        break
      case 'Enter':
        event.preventDefault()
        if (results.length > 0 && selectedIndex < results.length) {
          await handleSelectResult(results[selectedIndex])
        }
        break
      case 'Escape':
        window.close()
        break
    }
  }, [results, selectedIndex])

  const handleSelectResult = async (result: SearchResult) => {
    if (result.type === 'tab') {
      const tab = result.data as TabInfo
      await chromeService.switchToTab(tab.id)
    } else {
      const bookmark = result.data as BookmarkInfo
      if (bookmark.url) {
        await chromeService.openBookmark(bookmark.url)
      }
    }
    window.close()
  }

  const handleRefresh = async () => {
    await loadInitialData()
  }

  const handleCloseTab = async (tabId: number) => {
    try {
      await chromeService.closeTab(tabId)
      // Refresh the tab list after closing
      await loadInitialData()
    } catch (error) {
      console.error('Error closing tab:', error)
    }
  }

  return (
    <div className="search-interface">
      <div className="search-header">
        <SearchInput
          ref={searchInputRef}
          value={query}
          onChange={setQuery}
          onKeyDown={handleKeyDown}
          placeholder="Search tabs and bookmarks..."
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
        <div className="search-stats">
          {tabs.length} tabs, {bookmarks.length} bookmarks
        </div>
      </div>
      
      <SearchResults
        results={results}
        selectedIndex={selectedIndex}
        onSelectResult={handleSelectResult}
        onCloseTab={handleCloseTab}
        query={query}
      />
    </div>
  )
}