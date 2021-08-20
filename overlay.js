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
    element.setAttribute("name", BLOCKBUTTON_ID);
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

function UpdateBlockButtons(username) {
    let blockButtons = document.getElementsByName(BLOCKBUTTON_ID);
    for (let i = 0; i < blockButtons.length; i++) {
        let buttonUsername = GetUsernameFromHref(blockButtons[i].parentElement.href);
        if (buttonUsername == username) {
            ApplyBlockButtonStyle(blockButtons[i], IsBlocked(username));
        }
    }
}