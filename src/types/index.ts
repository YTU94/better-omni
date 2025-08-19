export interface TabInfo {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
  windowId: number;
  index: number;
  pinned: boolean;
  highlighted: boolean;
}

export interface BookmarkInfo {
  id: string;
  title: string;
  url?: string;
  dateAdded?: number;
  parentId?: string;
  favIconUrl?: string;
}

export interface SearchResult {
  type: 'tab' | 'bookmark';
  data: TabInfo | BookmarkInfo;
  score: number;
}