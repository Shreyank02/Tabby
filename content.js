// Content script that runs on all web pages
console.log('RAG Chatbot content script loaded on:', window.location.href);

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageContent') {
    // You can extract specific content from the page if needed
    const pageContent = {
      url: window.location.href,
      title: document.title,
      // You could add more specific content extraction here if needed
    };
    sendResponse(pageContent);
  }
});

// Optional: You can add functionality to highlight relevant content
// when user asks questions about specific parts of the page