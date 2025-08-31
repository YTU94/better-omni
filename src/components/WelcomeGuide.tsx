import React, { useState, useEffect } from 'react';
import './WelcomeGuide.css';

interface WelcomeGuideProps {
  onComplete: () => void;
}

export function WelcomeGuide({ onComplete }: WelcomeGuideProps) {
  const [shortcut, setShortcut] = useState('Cmd+Shift+K');
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    // 检测操作系统
    const platform = navigator.platform.toLowerCase();
    setIsMac(platform.includes('mac'));
    setShortcut(platform.includes('mac') ? 'Cmd+Shift+K' : 'Ctrl+Shift+K');
  }, []);

  const handleComplete = () => {
    // 保存用户已完成引导页的状态
    localStorage.setItem('quickTabLauncherGuideCompleted', 'true');
    onComplete();
  };

  return (
    <div className="welcome-guide">
      <div className="welcome-content">
        <h1>Welcome to Quick Tab Launcher</h1>
        <p className="subtitle">Quickly search and navigate between your tabs and bookmarks</p>
        
        <div className="guide-section">
          <h2>Getting Started</h2>
          <p>Use the keyboard shortcut to quickly open the search interface:</p>
          <div className="shortcut-display">
            <kbd>{shortcut}</kbd>
          </div>
          <p className="shortcut-note">
            You can customize this shortcut in Chrome's extension settings:
            <br />
            Chrome Menu → Settings → Extensions → Keyboard shortcuts
          </p>
        </div>

        <div className="guide-section">
          <h2>How to Use</h2>
          <ul>
            <li>Press the shortcut to open the search interface</li>
            <li>Type to search through your open tabs and bookmarks</li>
            <li>Use arrow keys to navigate results</li>
            <li>Press Enter to switch to a tab or open a bookmark</li>
            <li>Press Escape to close the interface</li>
          </ul>
        </div>

        <div className="guide-section">
          <h2>Features</h2>
          <ul>
            <li>Search through all open tabs</li>
            <li>Search through your bookmarks</li>
            <li>Quickly switch between tabs</li>
            <li>Open bookmarks directly</li>
            <li>Close tabs from the search interface</li>
          </ul>
        </div>

        <button className="cta-button" onClick={handleComplete}>
          Get Started
        </button>
      </div>
    </div>
  );
}