chrome.commands.onCommand.addListener((command) => {
  if (command === "quick-launch") {
    try {
      // Open a centered window instead of popup
      chrome.windows.getCurrent((currentWindow) => {
        if (chrome.runtime.lastError) {
          console.error('Error getting current window:', chrome.runtime.lastError);
          return;
        }

        const width = 700;
        const height = 650;
        const left = Math.round((currentWindow.width - width) / 2 + currentWindow.left);
        const top = Math.round((currentWindow.height - height) / 2 + currentWindow.top);

        chrome.windows.create({
          url: 'index.html',
          type: 'popup',
          width: width,
          height: height,
          left: left,
          top: top,
          focused: true
        }, (newWindow) => {
          if (chrome.runtime.lastError) {
            console.error('Error creating window:', chrome.runtime.lastError);
          } else {
            console.log('Quick Tab Launcher window opened:', newWindow.id);
          }
        });
      });
    } catch (error) {
      console.error('Error in command listener:', error);
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Quick Tab Launcher extension installed');
  
  // Set up keyboard shortcut on installation
  chrome.commands.getAll((commands) => {
    console.log('Available commands:', commands);
  });
});