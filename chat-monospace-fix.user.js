// ==UserScript==
// @name         Chat Redesign
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes chat look more like main
// @author       Redwolf Programs
// @match        https://chat.stackexchange.com/rooms/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement("style");

    document.head.appendChild(style);

    var sheet = style.sheet;

    sheet.insertRule([
        ".content code {",
        "font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, sans-serif;",
        "background-color: rgb(228, 230, 232);",
        "padding: 1px 5px",
        "}"
    ].join("\n"));
})();
