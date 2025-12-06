const WTS_SIGNATURES = {
  frameworks: [
    { name: 'React', test: () => !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || !!document.querySelector('[data-reactroot], [data-reactid]') },
    { name: 'Vue.js', test: () => !!window.__VUE_DEVTOOLS_GLOBAL_HOOK__ || !!document.querySelector('[data-v-app]') },
    { name: 'Angular', test: () => !!window.ng || !!document.querySelector('[ng-version]') },
    { name: 'jQuery', test: () => !!window.jQuery || !!window.$ },
  ],
  cms: [
    { name: 'WordPress', test: () => !!document.querySelector('meta[name="generator"][content*="WordPress" i]') || !!document.querySelector('link[href*="/wp-content/"]') },
    { name: 'Shopify', test: () => /shopify/i.test(document.documentElement.outerHTML) },
    { name: 'Wix', test: () => /wix\-static|wixapps/i.test(document.documentElement.outerHTML) },
  ],
  analytics: [
    { name: 'Google Analytics', test: () => /www\.google-analytics\.com|gtag\(|ga\(/i.test(document.documentElement.outerHTML) },
    { name: 'Google Tag Manager', test: () => /googletagmanager\.com/i.test(document.documentElement.outerHTML) },
    { name: 'Hotjar', test: () => /static\.hotjar\.com|hj\(/i.test(document.documentElement.outerHTML) },
  ],
  cdn: [
    { name: 'Cloudflare', test: () => /cdn-cgi|cloudflare/i.test(document.documentElement.outerHTML) },
    { name: 'Akamai', test: () => /akamai|akcdn/i.test(document.documentElement.outerHTML) },
    { name: 'Fastly', test: () => /fastly|fastly\.net/i.test(document.documentElement.outerHTML) },
  ],
};

function wts_detectDOM() {
  const detected = { frameworks: [], cms: [], analytics: [], cdn: [] };
  for (const k of Object.keys(WTS_SIGNATURES)) {
    for (const sig of WTS_SIGNATURES[k]) {
      try { if (sig.test()) detected[k].push(sig.name); } catch (e) {}
    }
  }
  return detected;
}

function wts_basicSecurityChecks(headers = {}) {
  const h = (n) => headers[n]?.toString() || headers[n.toLowerCase()] || '';
  const sec = {
    csp: !!h('content-security-policy'),
    hsts: !!h('strict-transport-security'),
    xfo: !!h('x-frame-options'),
    xcto: !!h('x-content-type-options'),
    refpol: !!h('referrer-policy'),
    server: h('server') || null,
    poweredBy: h('x-powered-by') || null,
  };
  return sec;
}
