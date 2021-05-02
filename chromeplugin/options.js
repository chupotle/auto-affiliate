function save_options() {
    var rawLinks = document.getElementById('links').value.trim();

    const re = /\n|,/;
    const splitLinks = rawLinks.split(re).map(item => item.trim());

    var myMap = new Map();

    for (const [key, value] of Object.entries(splitLinks)) {
        try {
            var link = new URL(value);
            myMap.set(link.origin, link.href);
            chrome.permissions.request({
                origins: [`${link.origin}/`]
            });
        } catch (error) {}
    }
    const obj = Object.fromEntries(myMap);

    var jsonString = JSON.stringify(obj);

    chrome.storage.sync.set({
        rawLinks: rawLinks,
        linkPairs: jsonString
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        var savedLinks = document.getElementById('validLinks');
        savedLinks.textContent = Array.from(myMap.values()).join("\r\n");
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        rawLinks: {},
        linkPairs: ""
    }, function (items) {
        document.getElementById('links').value = items.rawLinks;

        var jsonString = items.linkPairs;
        var tempObj = JSON.parse(jsonString);
        urlMap = new Map(Object.entries(tempObj));

        var savedLinks = document.getElementById('validLinks');
        savedLinks.textContent = Array.from(urlMap.values()).join("\r\n");
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);