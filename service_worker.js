const TAB_STORE = new Map();

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    try {
      const headers = Object.fromEntries(
        (details.responseHeaders || []).map(h => [h.name.toLowerCase(), h.value || ""]).filter(Boolean)
      );
      TAB_STORE.set(details.tabId, {
        ...(TAB_STORE.get(details.tabId) || {}),
        url: details.url,
        headers,
        ts: Date.now()
      });
    } catch (e) {
      console.error('header parse error', e);
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

// Cleanup when tab closes
chrome.tabs.onRemoved.addListener((tabId) => {
  TAB_STORE.delete(tabId);
});

// Message router
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'WTS_GET_HEADERS') {
    const data = TAB_STORE.get(sender.tab?.id || msg.tabId) || null;
    sendResponse({ ok: true, data });
    return true;
  }
  if (msg?.type === 'WTS_SET_OPTIONS') {
    chrome.storage.sync.set({ wtsOptions: msg.payload }, () => sendResponse({ ok: true }));
    return true;
  }
  if (msg?.type === 'WTS_GET_OPTIONS') {
    chrome.storage.sync.get('wtsOptions', (r) => sendResponse({ ok: true, data: r.wtsOptions || {} }));
    return true;
  }
});
