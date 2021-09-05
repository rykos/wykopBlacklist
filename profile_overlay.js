function BuildProfile() {
    let x = document.getElementsByClassName("m-reset-position m-make-center m-set-space")[0];

    let href = window.location.href.split('/');
    let username = href[href.length - 2];
    if (username == loggedUsername)
        return;
    let element = CreateBlockButton(IsBlocked(username), username);

    x.appendChild(element);
}

// BuildProfile();
promise.then((val) => {
    BuildProfile();
});