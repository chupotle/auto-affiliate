/************************ REDIRECT CODE ***********************/
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    return detectRedirect(details);
}, {
    urls : ["<all_urls>"],
    types: ["main_frame","sub_frame"]
}, ["blocking"]);

chrome.storage.onChanged.addListener(function () {
    fetchRefLinks();
});
chrome.runtime.onStartup.addListener(function () {
    fetchRefLinks();
});

function fetchRefLinks() {
    chrome.storage.sync.get({
        linkPairs: '{}'
    }, function (items) {
        var jsonString = items.linkPairs;
        var tempObj = JSON.parse(jsonString);
        urlMap = new Map(Object.entries(tempObj));
        console.log(urlMap);
    });
}

var urlMap;
fetchRefLinks();

function detectRedirect(details) {
    var url = new URL(details.url);
    if (url == null) {
        return;
    }

    var origin = url.origin;
    if (url.pathname == '/'  && !url.search && urlMap.has(origin)) {
        return { redirectUrl: urlMap.get(origin) };
    }
    return;
}