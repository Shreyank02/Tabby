// Background service worker for Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('RAG Chatbot Extension installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.url);
});

// Listen for tab updates to refresh chatbot when URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // You can add logic here to notify the popup when the URL changes
    console.log('Tab updated:', tab.url);
  }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentUrl') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ url: tabs[0].url });
    });
    return true; // Keep the message channel open for async response
  }
});