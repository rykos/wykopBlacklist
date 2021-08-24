/**
 * Hooks "more" buttons to observer that renders ui on loaded elements
 */
function HookMoreButtons() {
    let buttons = document.getElementsByClassName("more");
    for (let i = 0; i < buttons.length; i++) {
        let element = buttons[i];
        element.getElementsByTagName("a")[0].onclick = () => {
            let mutationObs = new MutationObserver(function (e) {
                mutationObs.disconnect();
                for (let j = 0; j < e[0].addedNodes.length; j++) {
                    RenderButtonOnProfile(e[0].addedNodes[j]);
                    CensorComment(e[0].addedNodes[j]);
                }
            });
            mutationObs.observe(element.parentElement.parentElement, { childList: true, subtree: true });
        };
    }
}

// (entry iC )
function RenderButtonOnProfile(profile) {
    if (!profile)
        return;

    profile = profile.getElementsByClassName("profile");
    for (let i = 0; i < profile.length; i++) {
        //Stop multiple renders
        if (ProfileIsReady(profile[i]))
            return;

        let username = GetUsernameFromHref(profile[i].href);
        let element = CreateBlockButton(IsBlocked(username), username);
        profile[i].appendChild(element);

        //Mark as rendered
        profile[i].setAttribute("data-blacklistrender", "done");
    }
}

function RenderButtonsOnProfiles(scope = document) {
    let profiles = scope.getElementsByClassName("profile");
    for (let i = 0; i < profiles.length; i++) {
        let username = GetUsernameFromHref(profiles[i].href);
        let element = CreateBlockButton(IsBlocked(username), username);
        profiles[i].appendChild(element);
    }
}

function BlockClick(event, username) {
    event.preventDefault();
    BlockUser(username);
    ApplyBlockButtonStyle(event.target, IsBlocked(username));
}

function CreateBlockButton(blocked, username) {
    let element = document.createElement("div");
    ApplyBlockButtonStyle(element, blocked);
    element.onclick = (event) => BlockClick(event, username);
    return element;
}

function ApplyBlockButtonStyle(element, blocked) {
    element.setAttribute("name", BLOCKBUTTON_ID);
    element.style.width = "100%";
    element.style.display = "flex";
    element.style.alignContent = "center";
    element.style.justifyContent = "center";
    element.style.borderRadius = "2px";
    element.style.fontSize = "10px";
    element.style.cursor = "pointer";
    if (blocked) {
        element.innerText = "unblock";
        element.style.backgroundColor = "rgb(82, 43, 43)";
    }
    else {
        element.innerText = "block";
        element.style.backgroundColor = "rgb(75, 75, 75)";
    }
}

function UpdateBlockButtons(username) {
    let blockButtons = document.getElementsByName(BLOCKBUTTON_ID);
    for (let i = 0; i < blockButtons.length; i++) {
        let buttonUsername = GetUsernameFromHref(blockButtons[i].parentElement.href);
        if (buttonUsername == username) {
            ApplyBlockButtonStyle(blockButtons[i], IsBlocked(username));
        }
    }
}

function CensorArticle(article) {
    let username = article.getElementsByClassName("fix-tagline")[0].querySelectorAll("[class^='color']")[0];
    if (!username)
        return;
    username = GetUsernameFromHref(username.href);
    if (IsBlocked(username)) {
        article.style.display = "none";

        let medias = article.getElementsByClassName("text")[0].getElementsByClassName("media-content");
        if (medias.length > 0) {
            medias[0].style.display = "none";
        }
        let elem = document.createElement("p");
        elem.innerText = "Wyswietl artykuł";
        elem.style.margin = "5px";
        elem.style.display = "flex";
        elem.style.justifyContent = "center";
        elem.style.cursor = "pointer";
        elem.onclick = (event) => {
            article.style.display = "block";
            event.target.style.display = "none";
        };
        article.parentElement.prepend(elem);
    }
}

function CensorArticles() {
    let articles = document.getElementsByClassName("article  clearfix preview   dC");
    for (let index = 0; index < articles.length; index++) {
        CensorArticle(articles[index]);
    }
}