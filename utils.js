function GetUsernameFromHref(href) {
    if (!href)
        return null;
    let split = href.split('/');
    if (split.length < 5)
        return null;
    return href.split('/')[4];
}

function BlockUser(username, autoupdate = true) {
    if ((new Blob([blockList])).size > 8000) {
        alert("google max storage reached\nNapisz do rykos na wykopie to naprawie bo teraz mi się nie chce ( ͡° ͜ʖ ͡°)");
        return;
    }
    if (IsBlocked(username)) {
        let index = blockList.indexOf(username);
        blockList.splice(index, 1);
    }
    else {
        if (username == loggedUsername) {
            alert("Już nie wolno blokować siebie samego ( ͡° ͜ʖ ͡°) idź coś innego zepsuć");
            return;
        }
        blockList.push(username);
    }
    chrome.storage.sync.set({ 'blocks': blockList }, function () { });

    if (autoupdate)
        UpdateBlockButtons(username);
}

function IsBlocked(username) {
    return blockList.includes(username);
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

function LoadBlacklistToMemory(data) {
    blockList = data;
    if (!blockList)
        blockList = [];
}

function ProfileIsReady(profile) {
    if (!profile.hasAttribute("data-blacklistrender"))
        return false;
    if (profile.dataset.blacklistrender != "done")
        return false;
    return true;
}

//m-reset-position m-make-center m-set-space