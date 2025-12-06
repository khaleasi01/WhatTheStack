(async function () {
  const domFindings = wts_detectDOM();

  function getHeaders() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'WTS_GET_HEADERS' }, (res) => {
        resolve(res?.data || null);
      });
    });
  }

  const headerData = await getHeaders();
  const headers = headerData?.headers || {};
  const sec = wts_basicSecurityChecks(headers);

  const report = {
    url: location.href,
    detectedAt: new Date().toISOString(),
    domFindings,
    headers,
    security: sec,
  };

  // Save to storage keyed by tabId (from background not available here), so use URL as key fallback
  const key = `wts:${location.origin}`;
  chrome.storage.session?.set?.({ [key]: report }) || chrome.storage.local.set({ [key]: report });

  // Expose minimal hook for popup
  window.__WHATTHESTACK__ = report;
})();
