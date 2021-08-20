function GetUsernameFromHref(href) {
    return href.split('/')[4];
}

function BlockUser(username) {
    if (IsBlocked(username)) {
        let index = blockList.indexOf(username);
        blockList.splice(index, 1);
    }
    else {
        blockList.push(username);
    }
    chrome.storage.sync.set({ 'blocks': blockList }, function () { console.log(blockList); });

    UpdateBlockButtons(username);
}

function IsBlocked(username) {
    if (blockList.includes(username))
        return true;
    else
        return false;
}

function IsBlocked(username) {
    return blockList.includes(username)
}

/**
 * Wykop lazy load breaks down when content is dynamically changed, quickfixed by forced eager load
*/
function eagerLoad() {
    var imgs = document.getElementsByTagName("img");
    for (let i = 0; i < imgs.length; i++) {
        if (imgs[i].dataset.original)
            imgs[i].src = imgs[i].dataset.original;
    }
}