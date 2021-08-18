
function CensorComment(comment) {
    if (IsBlocked(GetUsernameFromHref(comment.getElementsByClassName("profile")[0].href))) {
        console.log(comment);
        comment.getElementsByClassName("text")[0].getElementsByTagName("p")[0].style.display = "none";
        // comment.getElementsByClassName("text")[0].comment.getElementsByClassName("media-content")[0].style.display = "none";
        let medias = comment.getElementsByClassName("text")[0].getElementsByClassName("media-content");
        if (medias.length > 0) {
            console.log("medias detected");
            medias[0].style.display = "none";
        }
        let elem = document.createElement("p");
        elem.innerText = "Wyswietl komentarz";
        elem.style.margin = "5px";
        elem.style.display = "flex";
        elem.style.justifyContent = "center";
        elem.style.cursor = "pointer";
        elem.onclick = (event) => ShowCommentClick(event);
        comment.getElementsByClassName("text")[0].prepend(elem);
    }
}

function ShowCommentClick(event) {
    event.target.parentElement.getElementsByTagName("p")[1].style.display = "block";
    let medias = event.target.parentElement.getElementsByClassName("media-content");
    if (medias.length > 0) {
        console.log("medias detected");
        medias[0].style.display = "block";
    }
    event.target.style.display = "none";
}


function CensorComments(scope = document) {
    console.log("cc");
    // var subs = scope.querySelectorAll(".sub,.comments-stream");
    let subs = scope.getElementsByClassName("wblock lcontrast dC");
    for (let j = 0; j < subs.length; j++) {
        CensorComment(subs[j]);
    }
}
