// ==UserScript==
// @name         Quick Comments
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Alt + Shift + [0-9] to paste any custom comment
// @author       RedwolfPrograms
// @match        https://codegolf.stackexchange.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const MAPPING = {
        "0": "Welcome to Code Golf!",
        "1": "Welcome to Code Golf! This site is for competitive programming challenges, not general issues. You may want to check out [Stack Overflow](https://stackoverflow.com), although be sure to read the \"how to ask\".",
        "2": "Welcome to Code Golf! Nice first answer.",
        "3": "Welcome to Code Golf! This site is for competitive programming, so we require answers to have code.",
        "4": "Welcome to Code Golf! This site is for competitive programming, so we require answers to make a serious attempt at golfing. Make sure to read our [tips](https://codegolf.stackexchange.com/questions/tagged/tips?tab=Votes) questions if you want some hints!",
        "5": "I'd recommend using the [sandbox](https://codegolf.meta.stackexchange.com/questions/2140/sandbox-for-proposed-challenges) for future challenges.",
        "6": "Looks like an interesting language, I'll have to check it out sometime!",
        "7": "@xxxxxxxx Don't worry, happens a lot :p",
        "8": "@xxxxxxxx Never mind, I was wrong :p",
        "9": "@xxxxxxxx Yes, that's fine."
    };

    window.addEventListener("keydown", function(e) {
        if (e.code.match(/^Digit\d$/) && e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey) {
            var box = document.activeElement;
            var original = box.selectionStart;

            console.log(MAPPING[e.code[5]]);

            box.value = box.value.slice(0, box.selectionStart) + (MAPPING[e.code[5]] || "") + box.value.slice(box.selectionEnd);
            box.selectionStart = box.selectionEnd = original + (MAPPING[e.code[5]] || "").length;
        }
    });
})();
