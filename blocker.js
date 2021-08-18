const HIDER_ID = "hideThisShit";
const REPLACEBANNER_ID = "replaceBanner";

var blockList = [];

var posts = document.getElementsByClassName("entry iC");

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
}

function IsBlocked(username) {
    if (blockList.includes(username))
        return true;
    else
        return false;
}

function DisplayHiddenPost(element) {
    element.previousSibling.style.display = "block";
    element.style.display = "none";
}

function CreateHider() {
    let element = document.createElement("div");
    element.id = HIDER_ID;
    element.style.display = "none";
    return element;
}

function CreateRepleaceBanner(username) {
    let element = document.createElement("div");
    element.id = REPLACEBANNER_ID;
    element.style.display = "flex";
    element.style.justifyContent = "center";
    element.style.padding = "5px";
    element.style.cursor = "pointer";
    element.innerText = `Wyświetl zablokowany post - ${username}`;
    element.onclick = () => DisplayHiddenPost(element);
    return element;
}

function IsBlocked(username) {
    return blockList.includes(username)
}

function Filter() {
    for (let i = posts.length; i > 0; i--) {
        let username = posts[i - 1].getElementsByClassName("color-1 showProfileSummary")[0].text;
        if (IsBlocked(username)) {
            let hider = CreateHider();
            let children = posts[i - 1].children;
            posts[i - 1].appendChild(hider);
            let childrenCount = children.length;
            //Move post to hidden div
            for (let j = childrenCount - 1; j >= 0; j--) {
                if (children[j] && children[j].id != HIDER_ID)
                    hider.prepend(children[j]);
            }
            //Show banner in its place
            posts[i - 1].appendChild(CreateRepleaceBanner(username));
        }
    }
}

function BlockClick(event) {
    event.preventDefault();
    console.log(event.target.parentElement.href);
    let username = GetUsernameFromHref(event.target.parentElement.href);
    BlockUser(username);
    ApplyBlockButtonStyle(event.target, IsBlocked(username));
}

function CreateBlockButton(blocked) {
    console.log(blocked);
    let element = document.createElement("div");
    ApplyBlockButtonStyle(element, blocked);
    element.onclick = (event) => BlockClick(event);
    return element;
}

function ApplyBlockButtonStyle(element, blocked) {
    element.style.width = "100%";
    element.style.display = "flex";
    element.style.alignContent = "center";
    element.style.justifyContent = "center";
    element.style.borderRadius = "2px";
    element.style.fontSize = "10px";
    if (blocked) {
        element.innerText = "unblock";
        element.style.backgroundColor = "rgb(82, 43, 43)";
    }
    else {
        element.innerText = "block";
        element.style.backgroundColor = "rgb(75, 75, 75)";
    }
}

function RenderButtons() {
    let profiles = document.getElementsByClassName("profile");
    for (let i = 0; i < profiles.length; i++) {
        let username = GetUsernameFromHref(profiles[i].href);
        let element = CreateBlockButton(IsBlocked(username));
        profiles[i].appendChild(element);
    }
}

function eagerLoad() {
    //I could fix wykop lazy loading but i dont care XD
    var imgs = document.getElementsByTagName("img");
    for (let i = 0; i < imgs.length; i++) {
        if (imgs[i].dataset.original)
            imgs[i].src = imgs[i].dataset.original;
    }
}
eagerLoad();

chrome.storage.sync.get('blocks', function (result) {
    blockList = result.blocks;
    console.log(blockList);
    RenderButtons();
    Filter();
});