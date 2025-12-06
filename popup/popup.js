async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tab;
}

function setList(elId, arr) {
  const el = document.getElementById(elId);
  el.innerHTML = '';
  if (!arr || arr.length === 0) { el.innerHTML = '<li>—</li>'; return; }
  arr.forEach(x => {
    const li = document.createElement('li');
    li.textContent = x;
    el.appendChild(li);
  });
}

function badge(text, ok) {
  const span = document.createElement('span');
  span.className = `badge ${ok ? 'ok':'warn'}`;
  span.textContent = text;
  return span;
}

async function load() {
  const tab = await getActiveTab();

  // Ask background for headers for this tab
  const headersRes = await new Promise((resolve) => chrome.runtime.sendMessage({ type: 'WTS_GET_HEADERS', tabId: tab.id }, resolve));
  const headers = headersRes?.data?.headers || {};
  const url = headersRes?.data?.url || tab.url;

  // Inject content script detection results by querying storage (fallback)
  const key = `wts:${new URL(url).origin}`;
  const session = await chrome.storage.session.get?.(key) || {};
  const local = await new Promise(r => chrome.storage.local.get(key, r));
  const report = session[key] || local[key] || { url, domFindings: wts_detectDOM(), headers, security: wts_basicSecurityChecks(headers) };

  document.getElementById('url').textContent = (new URL(url)).host;

  // Fill lists
  setList('frameworks', report.domFindings.frameworks);
  setList('cms', report.domFindings.cms);
  setList('analytics', report.domFindings.analytics);
  setList('cdn', report.domFindings.cdn);

  const sec = report.security || wts_basicSecurityChecks(headers);
  const secList = document.getElementById('security');
  secList.innerHTML = '';
  const items = [
    ['Content-Security-Policy', sec.csp],
    ['Strict-Transport-Security', sec.hsts],
    ['X-Frame-Options', sec.xfo],
    ['X-Content-Type-Options', sec.xcto],
    ['Referrer-Policy', sec.refpol],
    ['Server', !!sec.server && sec.server],
    ['X-Powered-By', !!sec.poweredBy && sec.poweredBy]
  ];
  items.forEach(([k,v])=>{
    const li = document.createElement('li');
    if (typeof v === 'boolean') {
      li.appendChild(badge(k, v));
      if (!v) li.title = `${k} missing`;
    } else {
      li.textContent = `${k}: ${v || '—'}`;
    }
    secList.appendChild(li);
  });

  document.getElementById('badges').appendChild(badge('CSP', sec.csp));
  document.getElementById('badges').appendChild(badge('HSTS', sec.hsts));
  document.getElementById('badges').appendChild(badge('XFO', sec.xfo));

  // Copy JSON
  document.getElementById('copyJson').onclick = async () => {
    const copy = JSON.stringify(report, null, 2);
    await navigator.clipboard.writeText(copy);
    const btn = document.getElementById('copyJson');
    btn.textContent = 'Copied!';
    setTimeout(()=> btn.textContent='Copy JSON', 1200);
  };

  // Options
  document.getElementById('openOptions').onclick = () => chrome.runtime.openOptionsPage();
}

load();