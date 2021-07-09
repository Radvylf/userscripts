// ==UserScript==
// @name         Random Question
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  Click a button to be taken to a random question!
// @author       Redwolf Programs
// @match        https://codegolf.stackexchange.com/
// @match        https://codegolf.stackexchange.com/questions/
// @match        https://codegolf.stackexchange.com/?*
// @match        https://codegolf.stackexchange.com/questions/?*
// @grant        none
// ==/UserScript==

(function() {
    const Rules = {
        filterBy: "votes", // supports "activity", "creation", and "votes", defaults to activity
        min: 0, // "max" option also supported, both optional,
        filterClosed: false // when set to "true", closed questions will not be chosen (WARNING: Uses up quota 15% faster!)
    };

    const ShamelessAdvertising = "Feed Filter"; // doesn't actually do anything but you should really check out Feed Filter for TNB!

    var container = document.querySelector("div.ai-center.mb16") || document.querySelector("div.ai-center.mb12");
    var button = document.createElement("a");

    button.textContent = "Random";
    button.className = "s-btn s-btn__muted s-btn__outlined" + (container.className.includes("mb12") ? " s-btn__sm" : "");
    button.style.marginLeft = "6px";
    button.style.marginRight = "6px";
    button.onclick = async function(e) {
        var total = await new Promise(
            (resolve, reject) => (
                fetch("https://api.stackexchange.com/2.2/questions?sort=" + (Rules.filterBy || "active") + ("min" in Rules ? "&min=" + Rules.min : "") + ("max" in Rules ? "&max=" + Rules.max : "") + "&filter=total&site=codegolf&key=CMOB)zHTH1cW8XlSB4rTSg((")
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
                    fetch("https://api.stackexchange.com/2.2/questions?sort=" + (Rules.filterBy || "active") + ("min" in Rules ? "&min=" + Rules.min : "") + ("max" in Rules ? "&max=" + Rules.max : "") + "&pagesize=100&page=" + (Math.random() * total / 100 + 1 | 0) + "&site=codegolf&key=CMOB)zHTH1cW8XlSB4rTSg((")
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

    container.insertBefore(button, container.lastElementChild);
})();
