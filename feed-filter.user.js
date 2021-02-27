// ==UserScript==
// @name         Feed Filter (TNB)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically feeds butter to annoying chat feeds, by hiding, minimizing, or adding functionality to them.
// @author       Redwolf Programs
// @match        https://chat.stackexchange.com/rooms/240/the-nineteenth-byte
// @grant        none
// ==/UserScript==

// "Documentation": https://codegolf.meta.stackexchange.com/questions/19402/feed-filter-a-tnb-userscript

(function() {
    const Results = {
        HIDDEN: 0,
        MINIMIZED: 1,
        MODIFIED: 2,
        ORIGINAL: 3
    };

    const Rules = [
        {
            owners: ["New Main Posts", "New Meta Posts", "Newly Featured Questions"],
            title: /\[(closed|duplicate)\]$/,
            result: Results.MINIMIZED
        },
        {
            owners: ["New Main Posts", "New Meta Posts", "Newly Featured Questions"],
            votes: {
                max: -1
            },
            result: Results.MINIMIZED
        },
        {
            owners: ["New Sandboxed Posts", "New Loophole Proposal", "New Bounties With No Deadlines"],
            original: /^.{1,100}[\n\r]+/,
            result: Results.MODIFIED
        }
    ];

    var chat = document.getElementById("chat");

    var observer = new MutationObserver(function() {
        var monos = document.querySelectorAll("div.monologue");

        var posts = [...monos].filter(m => m.querySelector(".ob-post"));

        posts = [].concat.apply([], posts.map(p => [...p.querySelectorAll(".message")].filter(m => m.querySelector(".ob-post"))));

        posts = posts.map(p => ({
            owner: p.parentNode.parentNode.children[0].children[2].textContent,
            monologue: p.parentNode.parentNode,
            message: p,
            votes: +p.querySelector(".ob-post").children[0].textContent,
            title: p.querySelector(".ob-post").children[2],
            body: p.querySelector(".ob-post").children[3]
        }));

        posts = posts.filter(p => Rules.some(r => (!("owners" in r) || r.owners.includes(p.owner))) && !p.message.getAttribute("observed"));

        posts.forEach(p => {
            for (let r, t, b, i = 0; i < Rules.length; i++) {
                r = Rules[i];

                p.message.setAttribute("observed", "true");

                if ("owners" in r && !r.owners.includes(p.owner))
                    continue;

                if ("votes" in r) {
                    if (typeof r == "number") {
                        if (p.votes != r.votes)
                            continue;
                    } else {
                        if ("min" in r.votes && p.votes < r.votes.min)
                            continue;

                        if ("max" in r.votes && p.votes > r.votes.max)
                            continue;
                    }
                }

                if ("original" in r && !r.original.test(p.body.childNodes[1].textContent))
                    continue;

                if (p.title.childNodes[0].textContent[0] == "Q") {
                    t = p.title.childNodes[1].textContent;
                    b = p.body.childNodes[1].textContent.replace(/[\n\r]+/g, "↵");
                } else {
                    t = p.body.childNodes[1].textContent.split(/[\n\r]+/)[0];
                    b = p.body.childNodes[1].textContent.split(/[\n\r]+/).slice(1).join("↵");
                }

                if ("title" in r && !r.title.test(t))
                    continue;

                if ("body" in r && !r.title.test(b))
                    continue;

                switch (r.result) {
                    case Results.HIDDEN:
                        chat.removeChild(p.monologue);

                        break;
                    case Results.MINIMIZED:
                        p.title.childNodes[1].textContent = t;

                        if (p.body.parentNode.children[4])
                            p.body.parentNode.removeChild(p.body.parentNode.children[4]);

                        p.body.parentNode.removeChild(p.body);

                        break;
                    case Results.MODIFIED:
                        p.title.childNodes[1].textContent = t;
                        p.body.childNodes[1].textContent = b;

                        break;
                    case Results.ORIGINAL:
                        break;
                }

                break;
            }
        });
    });

    observer.observe(chat, {
        attributes: false,
        childList: true,
        subtree: true
    });
})();
