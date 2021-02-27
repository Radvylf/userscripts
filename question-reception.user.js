// ==UserScript==
// @name         Question Reception
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds custom information including upvote count, downvote count, upvote vs. downvote percentage, and controversialness (according to my rating scale)
// @author       Redwolf Programs
// @match        https://codegolf.stackexchange.com/questions/*
// @grant        none
// ==/UserScript==

(async function() {
    var config = {
        name: "Reception",
        order: 3,
        format: (up, down, percent, min_max) => up || down ? Math.round(10000 * percent) / 100 + "% (" + (Math.round(min_max * 1000) / 1000 + ".0").split(".").slice(0, 2).join(".") + ")" : "No votes"
    };

    var id = location.href.match(/\/questions\/[0-9]+\//g);

    if (id.length != 1) {
        throw new Error("URL format has changed; tell Redwolf to fix it");

        return;
    }

    var votes = await fetch("https://codegolf.stackexchange.com/posts/" + id[0].match(/[0-9]+/g)[0] + "/vote-counts").then(response => response.json());
    var count = null;

    if (!votes || typeof votes != "object" || !("up" in votes) || !("down" in votes)) {
        console.error("Controversialness: Unexpected Response: " + JSON.stringify(votes));
    } else {
        console.log("Votes: " + votes.up + " / " + votes.down);

        count = [+votes.up.match(/[0-9]+/g)[0], +votes.down.match(/[0-9]+/g)[0]];
    }

    var text_container = document.querySelectorAll(".pb8");

    if (text_container.length != 1 || text_container[0].children.length != 3) {
        throw new Error("Layout has changed; tell Redwolf to fix it");

        return;
    }

    var third_item = text_container[0].children[2].cloneNode(true);

    if (third_item.childNodes.length != 3) {
        throw new Error("Layout (2) has changed; tell Redwolf to fix it");

        return;
    }

    if (config.order == 3) {
        text_container[0].children[config.order - 1].classList.add("mr16");
        text_container[0].appendChild(third_item);
    } else {
        third_item.classList.add("mr16");
        text_container[0].insertBefore(third_item, text_container[0].children[config.order]);
    }

    third_item.childNodes[1].textContent = config.name;
    third_item.childNodes[2].textContent = " " + (count ? config.format(count[0], count[1], count[0] / (count[0] + count[1]), Math.min(...count) ** 2 / Math.max(...count)) : "Unknown");
})();
