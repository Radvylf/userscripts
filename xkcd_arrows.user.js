// ==UserScript==
// @name         XKCD Arrows
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds several features for viewing XKCD, including the ability to navigate between them with arrow keys
// @author       Redwolf Programs
// @match        *://xkcd.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var center = function() {
        var cTop = document.querySelector("#topContainer");
        var cMiddle = document.querySelector("#middleContainer");
        if (cMiddle.offsetHeight < window.innerHeight)
            window.scrollTo(0, cTop.offsetHeight + cMiddle.offsetHeight / 2 - window.innerHeight / 2 + 13);
        else
            window.scrollTo(0, cTop.offsetHeight + 13);
    };
    var int = setInterval(function() {
        var img = document.querySelector("#comic img");
        var title = document.createElement("p");
        var cTop = document.querySelector("#topContainer");
        var cMiddle = document.querySelector("#middleContainer");
        if (!img.offsetHeight)
            return;
        console.log(img.offsetHeight);
        img.style.display = "block";
        img.style.margin = "auto";
        title.style.maxWidth = "520px";
        title.style.margin = "auto";
        title.style.paddingTop = "13.015px";
        title.style.fontSize = "12px";
        title.textContent = img.title;
        document.querySelector("#comic").appendChild(title);
        clearInterval(int);
        center();
    }, 20);
    window.addEventListener("keyup", function() {
        if (event.code == "ArrowLeft")
            window.location.replace(document.querySelector("a[rel=prev]").href);
        else if (event.code == "ArrowRight")
            window.location.replace(document.querySelector("a[rel=next]").href);
        else if (event.code == "ShiftRight")
            center();
    });
})();
