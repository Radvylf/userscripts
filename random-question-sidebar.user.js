// ==UserScript==
// @name         Random Question
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Click a button to be taken to a random question!
// @author       Redwolf Programs
// @match        https://codegolf.stackexchange.com/*
// @grant        none
// ==/UserScript==

(function() {
    const Rules = {
        filterBy: "votes", // supports "activity", "creation", and "votes", defaults to activity
        min: 0, // "max" option also supported, both optional
        filterClosed: true // when set to "true", closed questions will not be chosen (WARNING: Uses up quota 15% faster!)
    };

    const ShamelessAdvertising = "Feed Filter"; // doesn't actually do anything but you should really check out Feed Filter for TNB!

    var container = document.querySelector("#nav-jobs").parentNode.parentNode;
    var listItem = document.createElement("li");
    var anchor = document.createElement("a");
    var gridCenter = document.createElement("div");
    var gridText = document.createElement("div");

    anchor.className = "pl8 js-gps-track nav-links--link";
    gridCenter.className = "grid ai-center";
    gridText.className = "grid--cell truncate";

    gridText.textContent = "Random";
    anchor.onclick = async function(e) {
        var total = await new Promise(
            (resolve, reject) => (
                fetch("https://api.stackexchange.com/2.2/questions?sort=" + (Rules.filterBy || "active") + ("min" in Rules ? "&min=" + Rules.min : "") + ("max" in Rules ? "&max=" + Rules.max : "") + "&filter=total&site=codegolf")
                .then(response => response.json())
                .then(result => resolve(result.total))
                .catch(error => reject(error))
            )
        );

        console.log(total);

        var page;

        do
            page = await new Promise(
                (resolve, reject) => (
                    fetch("https://api.stackexchange.com/2.2/questions?sort=" + (Rules.filterBy || "active") + ("min" in Rules ? "&min=" + Rules.min : "") + ("max" in Rules ? "&max=" + Rules.max : "") + "&pagesize=100&page=" + (Math.random() * total / 100 + 1 | 0) + "&site=codegolf")
                    .then(response => response.json())
                    .then(result => resolve(result.items[Math.random() * result.items.length | 0]))
                    .catch(error => reject(error))
                )
            );
        while (Rules.filterClosed && page.closed_date);

        if (e.ctrlKey || e.shiftKey)
            window.open(page.link);
        else
            location.href = page.link;
    };

    gridCenter.appendChild(gridText);
    anchor.appendChild(gridCenter);
    listItem.appendChild(anchor);

    container.insertBefore(listItem, container.lastElementChild);
})();
