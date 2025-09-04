import type { TabInfo, BookmarkInfo } from '../types';

// Mock data for development
const MOCK_TABS: TabInfo[] = [
  {
    id: 1,
    title: 'GitHub - facebook/react: The library for web and native user interfaces.',
    url: 'https://github.com/facebook/react',
    favIconUrl: 'https://github.githubassets.com/favicons/favicon.svg',
    windowId: 1,
    index: 0,
    pinned: false,
    highlighted: true
  },
  {
    id: 2,
    title: 'Google', 
    url: 'https://www.google.com',
    favIconUrl: 'https://www.google.com/favicon.ico',
    windowId: 1,
    index: 1,
    pinned: false,
    highlighted: false
  },
  {
    id: 3,
    title: 'Stack Overflow - Where Developers Learn, Share, & Build Careers',
    url: 'https://stackoverflow.com',
    favIconUrl: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico',
    windowId: 1,
    index: 2,
    pinned: true,
    highlighted: false
  },
  {
    id: 4,
    title: 'MDN Web Docs', 
    url: 'https://developer.mozilla.org/en-US/',
    // favIconUrl: 'https://developer.mozilla.org/favicon-48x48.cbbd161b.png',
    windowId: 1,
    index: 3,
    pinned: false,
    highlighted: false
  },
  {
    id: 5,
    title: 'npm', 
    url: 'https://www.npmjs.com',
    favIconUrl: 'https://static.npmjs.com/attachments/ck3uwe05o00eo3575jjd7fjaj-npm-logo.svg',
    windowId: 1,
    index: 4,
    pinned: false,
    highlighted: false
  }
];

const MOCK_BOOKMARKS: BookmarkInfo[] = [
  {
    id: '1',
    title: 'GitHub',
    url: 'https://github.com',
    dateAdded: Date.now(),
    parentId: '0',
    favIconUrl: 'https://github.githubassets.com/favicons/favicon.svg'
  },
  {
    id: '2',
    title: 'React Documentation',
    url: 'https://react.dev',
    dateAdded: Date.now(),
    parentId: '0',
    favIconUrl: 'https://react.dev/favicon.ico'
  },
  {
    id: '3',
    title: 'TypeScript Documentation',
    url: 'https://www.typescriptlang.org',
    dateAdded: Date.now(),
    parentId: '0',
    favIconUrl: 'https://www.typescriptlang.org/favicon-32x32.png'
  },
  {
    id: '4',
    title: 'Vite',
    url: 'https://vitejs.dev',
    dateAdded: Date.now(),
    parentId: '0',
    favIconUrl: 'https://vitejs.dev/logo.svg'
  },
  {
    id: '5',
    title: 'Chrome Extension Documentation',
    url: 'https://developer.chrome.com/docs/extensions',
    dateAdded: Date.now(),
    parentId: '0',
    favIconUrl: 'https://www.google.com/favicon.ico'
  }
];

class ChromeService {
  async getAllTabs(): Promise<TabInfo[]> {
    // Check if we're in a Chrome extension environment
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      // Use mock data if chrome API is not available
      return new Promise(resolve => setTimeout(() => resolve(MOCK_TABS), 500));
    }
    
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
      return MOCK_TABS; // Fallback to mock data on error
    }
  }

  async getAllBookmarks(): Promise<BookmarkInfo[]> {
    // Check if we're in a Chrome extension environment
    if (typeof chrome === 'undefined' || !chrome.bookmarks) {
      // Use mock data if chrome API is not available
      return new Promise(resolve => setTimeout(() => resolve(MOCK_BOOKMARKS), 500));
    }
    
    try {
      const bookmarks = await chrome.bookmarks.getTree();
      return this.flattenBookmarks(bookmarks);
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return MOCK_BOOKMARKS; // Fallback to mock data on error
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
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      console.log('Chrome API not available, mock switch to tab:', tabId);
      return;
    }
    
    try {
      await chrome.tabs.update(tabId, { active: true });
      const tab = await chrome.tabs.get(tabId);
      await chrome.windows.update(tab.windowId, { focused: true });
    } catch (error) {
      console.error('Error switching to tab:', error);
    }
  }

  async openBookmark(url: string): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      console.log('Chrome API not available, mock open bookmark:', url);
      return;
    }
    
    try {
      await chrome.tabs.create({ url });
    } catch (error) {
      console.error('Error opening bookmark:', error);
    }
  }

  async closeTab(tabId: number): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      console.log('Chrome API not available, mock close tab:', tabId);
      return;
    }
    
    try {
      await chrome.tabs.remove(tabId);
    } catch (error) {
      console.error('Error closing tab:', error);
      throw error;
    }
  }
}

export const chromeService = new ChromeService();