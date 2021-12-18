const TITLE = "Generate Markdown link";

function copyUrl({ label, href }) {
  if (label === null) return;
  Clipboard.copy(`[${label}](${href})`);
}
browser.runtime.onMessage.addListener(copyUrl);

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
function initializePageAction(tab) {
  browser.pageAction.setIcon({ tabId: tab.id, path: "icons/copy-link.svg" });
  browser.pageAction.setTitle({ tabId: tab.id, title: TITLE });
  // browser.pageAction.setPopup({ tabId: tab.id, popup: '/popup/popup.html' });
  browser.pageAction.show(tab.id);
}

/*
Wrap a listener and pass an extra boolean argument to detect double clicks
*/
function createDoubleClickListener(listener) {
  let timeout;
  return (...args) => {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        listener(...args, false);
      }, 500);
    } else {
      clearTimeout(timeout);
      timeout = null;
      listener(...args, true);
    }
  }
}

/*
When first loaded, initialize the page action for all tabs.
*/
var gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then((tabs) => {
  for (let tab of tabs) {
    initializePageAction(tab);
  }
});

/*
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});

let settings;
browser.storage.sync.get().then((value) => { settings = value; });
browser.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  Object.keys(changes).forEach((key) => {
    settings[key] = changes[key].newValue;
  })
})

browser.pageAction.onClicked.addListener(
  createDoubleClickListener((tab, onClickData, doubleClick) => {
    if (!settings) return;
    const { label, labelEnabled } = settings;

    if (labelEnabled && !doubleClick) copyUrl({ label, href: tab.url });
    else {
      browser.tabs.executeScript({
        code: `browser.runtime.sendMessage({ label: window.prompt('Enter label:'), href: '${tab.url}' });`
      });
    }
  })
);
