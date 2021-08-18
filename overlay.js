/**
 * Hooks "more" buttons to observer that renders ui on loaded elements
 */
function HookMoreButtons() {
    let btns = document.getElementsByClassName("more");
    for (let i = 0; i < btns.length; i++) {
        btns[i].getElementsByTagName("a")[0].onclick = () => {
            console.log(btns[i]);
            var mutationObs = new MutationObserver(function (e) {
                mutationObs.disconnect();
                for (let i = 0; i < e[0].addedNodes.length; i++) {
                    RenderButtonOnProfile(e[0].addedNodes[i]);
                    CensorComment(e[0].addedNodes[i]);
                }
            });
            mutationObs.observe(btns[i].parentElement.parentElement, { childList: true, subtree: true });
        };
    }
}

function RenderButtonOnProfile(profile) {
    profile = profile.getElementsByClassName("profile")[0];
    let username = GetUsernameFromHref(profile.href);
    let element = CreateBlockButton(IsBlocked(username));
    profile.appendChild(element);
}

function RenderButtonsOnProfiles(scope = document) {
    let profiles = scope.getElementsByClassName("profile");
    for (let i = 0; i < profiles.length; i++) {
        let username = GetUsernameFromHref(profiles[i].href);
        let element = CreateBlockButton(IsBlocked(username));
        profiles[i].appendChild(element);
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