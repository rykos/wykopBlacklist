const HIDER_ID = "wykopBlacklistHider";
const REPLACEBANNER_ID = "wykopBlacklistReplaceBanner";
const BLOCKBUTTON_ID = "wykopblacklistBlockButton";

var blockList = [];
var loggedUsername = "";

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
var promise;
function Main() {
    //Force eager load
    eagerLoad();
    this.loggedUsername = GetUsernameFromHref(document.getElementsByClassName("logged-user ddC")[0]?.getElementsByTagName("a")[0]?.href);

    //Load blocked users and proceed to block content
    promise = new Promise((resolve, reject) => {
        chrome.storage.sync.get('blocks', function (result) {
            blockList = result.blocks;
            if (!blockList)
                blockList = [];

            RenderButtonsOnProfiles();
            CensorPosts();
            CensorComments();
            HookMoreButtons();
            CensorArticles();

            //Streams (entry iC) objects containing => comments (wblock lcontrast dC)
            //                                      => articles (article  clearfix preview   dC)
            let streamer = document.getElementById("itemsStream");

            let mutationObs = new MutationObserver(function (e) {
                //Each added node entry iC
                for (let j = 0; j < e[0].addedNodes.length; j++) {
                    //Ignore text node
                    if (e[0].addedNodes[j].nodeType == 3)
                        continue;
                    RenderButtonOnProfile(e[0].addedNodes[j]);
                    //Streamed comments
                    let comments = e[0].addedNodes[j].getElementsByClassName("wblock lcontrast dC");
                    for (let i = 0; i < comments.length; i++) {
                        CensorComment(comments[i]);
                    }
                    //Streamed articles
                    let articles = e[0].addedNodes[j].getElementsByClassName("article  clearfix preview   dC");
                    for (let i = 0; i < articles.length; i++) {
                        CensorArticle(articles[i]);
                    }
                }
            });
            if (streamer)
                mutationObs.observe(streamer, { childList: true, subtree: true });

            resolve();
        });
    });
}

Main();