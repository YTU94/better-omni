import type { TabInfo, BookmarkInfo } from '../types';

class ChromeService {
  async getAllTabs(): Promise<TabInfo[]> {
    try {
      const tabs = await chrome.tabs.query({});
      return tabs.map(tab => ({
        id: tab.id!,
        title: tab.title || 'Untitled',
        url: tab.url || '',
        favIconUrl: tab.favIconUrl,
        windowId: tab.windowId,
        index: tab.index,
        pinned: tab.pinned,
        highlighted: tab.highlighted
      }));
    } catch (error) {
      console.error('Error getting tabs:', error);
      return [];
    }
  }

  async getAllBookmarks(): Promise<BookmarkInfo[]> {
    try {
      const bookmarks = await chrome.bookmarks.getTree();
      return this.flattenBookmarks(bookmarks);
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  }

  private flattenBookmarks(bookmarkTreeNodes: chrome.bookmarks.BookmarkTreeNode[]): BookmarkInfo[] {
    const bookmarks: BookmarkInfo[] = [];
    
    const traverse = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
      for (const node of nodes) {
        if (node.url) {
          bookmarks.push({
            id: node.id,
            title: node.title || 'Untitled',
            url: node.url,
            dateAdded: node.dateAdded,
            parentId: node.parentId,
            favIconUrl: `chrome://favicon/${node.url}`
          });
        }
        if (node.children) {
          traverse(node.children);
        }
      }
    };
    
    traverse(bookmarkTreeNodes);
    return bookmarks;
  }

  async switchToTab(tabId: number): Promise<void> {
    try {
      await chrome.tabs.update(tabId, { active: true });
      const tab = await chrome.tabs.get(tabId);
      await chrome.windows.update(tab.windowId, { focused: true });
    } catch (error) {
      console.error('Error switching to tab:', error);
    }
  }

  async openBookmark(url: string): Promise<void> {
    try {
      await chrome.tabs.create({ url });
    } catch (error) {
      console.error('Error opening bookmark:', error);
    }
  }
}

export const chromeService = new ChromeService();