var rxLookfor = /^https:\/\/www\.facebook\.com\/groups\/.*/;
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (rxLookfor.test(tab.url)) {
        chrome.browserAction.setIcon({path: 'icon48.png'});
    } else {
        chrome.browserAction.setIcon({path: 'inactive_icon.png'});
    }
});