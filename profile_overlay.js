function BuildProfile() {
    let x = document.getElementsByClassName("m-reset-position m-make-center m-set-space")[0];

    let username = GetUsernameFromHref(window.location.href);
    let element = CreateBlockButton(IsBlocked(username), username);

    x.appendChild(element);
}

// BuildProfile();
promise.then((val) => {
    BuildProfile();
});