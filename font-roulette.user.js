// ==UserScript==
// @name         Font Roulette
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Is this the end of the world?
// @author       Ryan Tosh
// @match        https://chat.stackexchange.com/rooms/136286/the-sand-trap
// @grant        none
// ==/UserScript==

(async () => {
    var fonts = JSON.parse(await (await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCr4qvH8qbH2qaqjX5tIVfB-mZDgW3tkvE")).text());

    var family = fonts.items[Math.random() * fonts.items.length | 0].family;

    window.WebFontConfig = {
        google: {
            families: [family]
        },
        active: () => {
            var style = document.createElement("style");

            style.textContent = "* { font-family: " + JSON.stringify(family) + " !important; }";

            document.head.appendChild(style);

            console.log("Now using: " + family);
        }
    };

    eval(await (await fetch("https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js")).text());
})();
