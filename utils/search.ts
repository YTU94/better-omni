import type { TabInfo, BookmarkInfo, SearchResult } from '../types';

export class SearchEngine {
  searchTabs(tabs: TabInfo[], query: string): SearchResult[] {
    if (!query.trim()) {
      return tabs.map(tab => ({
        type: 'tab',
        data: tab,
        score: 0
      }));
    }

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    for (const tab of tabs) {
      const titleScore = this.calculateScore(tab.title, lowerQuery);
      const urlScore = this.calculateScore(tab.url, lowerQuery);
      const score = Math.max(titleScore, urlScore);

      if (score > 0) {
        results.push({
          type: 'tab',
          data: tab,
          score
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  searchBookmarks(bookmarks: BookmarkInfo[], query: string): SearchResult[] {
    if (!query.trim()) {
      return [];
    }

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    for (const bookmark of bookmarks) {
      const titleScore = this.calculateScore(bookmark.title, lowerQuery);
      const urlScore = bookmark.url ? this.calculateScore(bookmark.url, lowerQuery) : 0;
      const score = Math.max(titleScore, urlScore);

      if (score > 0) {
        results.push({
          type: 'bookmark',
          data: bookmark,
          score
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  private calculateScore(text: string, query: string): number {
    const lowerText = text.toLowerCase();
    
    if (lowerText === query) return 100;
    if (lowerText.startsWith(query)) return 90;
    if (lowerText.includes(query)) return 70;
    
    const queryWords = query.split(' ');
    let score = 0;
    
    for (const word of queryWords) {
      if (lowerText.includes(word)) {
        score += 30;
      }
    }
    
    return Math.min(score, 80);
  }
}

export const searchEngine = new SearchEngine();