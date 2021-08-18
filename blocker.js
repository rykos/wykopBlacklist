const HIDER_ID = "wykopBlacklistHider";
const REPLACEBANNER_ID = "wykopBlacklistReplaceBanner";

var blockList = [];

var posts = document.getElementsByClassName("entry iC");

function DisplayHiddenPost(element) {
    element.previousSibling.style.display = "block";
    element.style.display = "none";
}

function CreateHiderElement() {
    let element = document.createElement("div");
    element.id = HIDER_ID;
    element.style.display = "none";
    return element;
}

function CreateReplaceBanner(username) {
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

function CensorPosts() {
    for (let i = posts.length; i > 0; i--) {
        let username = GetUsernameFromHref(posts[i - 1].getElementsByClassName("profile")[0].href);
        if (IsBlocked(username)) {
            let hider = CreateHiderElement();
            let children = posts[i - 1].children;
            posts[i - 1].appendChild(hider);
            let childrenCount = children.length;
            //Move post to hidden div
            for (let j = childrenCount - 1; j >= 0; j--) {
                if (children[j] && children[j].id != HIDER_ID)
                    hider.prepend(children[j]);
            }
            //Show banner in its place
            posts[i - 1].appendChild(CreateReplaceBanner(username));
        }
    }
}

function Main() {
    //Force eager load
    eagerLoad();

    //Load blocked users and proceed to block content
    chrome.storage.sync.get('blocks', function (result) {
        blockList = result.blocks;
        if (!blockList)
            blockList = [];
            
        console.log(blockList);
        RenderButtonsOnProfiles();
        CensorPosts();
        CensorComments();
        HookMoreButtons();
    });
}

Main();