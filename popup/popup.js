function ColorRows() {
    let elements = document.getElementById("container").children;
    for (let i = 0; i < elements.length; i++) {
        let elem = elements[i];
        let button = elem.getElementsByTagName("button")[0];
        if (i % 2 == 0) {
            elem.style.backgroundColor = "#999";
            button.style.backgroundColor = "#ABABAB";
        }
        else {
            elem.style.backgroundColor = "#bbb";
            button.style.backgroundColor = "#cbcbcb";
        }
    }
}

chrome.storage.sync.get('blocks', function (result) {
    LoadBlacklistToMemory(result.blocks);
    //
    let blocks = result.blocks;
    blocks.sort();

    let container = document.getElementById("container");
    for (let i = 0; i < blocks.length; i++) {
        let username = blocks[i];
        let button = document.createElement("button");
        button.innerText = "unblock";
        button.id = username;

        let elem = document.createElement("div");
        let textElem = document.createElement("div");
        textElem.innerText = username;
        textElem.style.overflow = "hidden";
        elem.appendChild(textElem);
        // elem.innerText = username;
        elem.style.width = "100%";
        elem.style.display = "flex";
        elem.style.justifyContent = "space-between";
        elem.style.fontSize = "15px";
        if (i % 2 == 0) {
            elem.style.backgroundColor = "#999";
            button.style.backgroundColor = "#ABABAB";
        }
        else {
            elem.style.backgroundColor = "#bbb";
            button.style.backgroundColor = "#cbcbcb";
        }
        elem.appendChild(button);


        container.appendChild(elem);

        button.onclick = (event) => {
            BlockUser(username, false);
            elem.remove();
            ColorRows();
        };
    }
});