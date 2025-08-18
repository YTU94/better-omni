import { forwardRef } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (event: React.KeyboardEvent) => void
  placeholder?: string
  isLoading?: boolean
  onRefresh?: () => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({
  value,
  onChange,
  onKeyDown,
  placeholder = 'Search...',
  isLoading = false,
  onRefresh
}, ref) => {
  return (
    <div className="search-input-container">
      <div className="search-input-wrapper">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="search-input"
          autoFocus
        />
        <div className="search-actions">
          {isLoading && <div className="loading-spinner">⟳</div>}
          {onRefresh && (
            <button 
              className="refresh-button" 
              onClick={onRefresh}
              title="Refresh data"
            >
              ↻
            </button>
          )}
        </div>
      </div>
    </div>
  )
})