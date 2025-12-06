function get(id){return document.getElementById(id)}

chrome.runtime.sendMessage({ type: 'WTS_GET_OPTIONS' }, (res) => {
  const opts = res?.data || {};
  get('allowlist').value = (opts.allowlist || []).join(', ');
  get('exclude').value = (opts.exclude || []).join(', ');
});

get('save').onclick = () => {
  const payload = {
    allowlist: get('allowlist').value.split(',').map(s=>s.trim()).filter(Boolean),
    exclude: get('exclude').value.split(',').map(s=>s.trim()).filter(Boolean)
  };
  chrome.runtime.sendMessage({ type: 'WTS_SET_OPTIONS', payload }, (r)=>{
    const st = document.getElementById('status');
    st.textContent = 'Saved';
    setTimeout(()=> st.textContent = '', 1200);
  });
};
