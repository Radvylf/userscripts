// ==UserScript==
// @name         Chat Monospace Fix
// @namespace    http://tampermonkey.net/
// @version      1.1
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
        ".message code {",
        "font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, sans-serif;",
        "background-color: rgb(228, 230, 232);",
        "padding: 1px 5px",
        "}"
    ].join("\n"));

    sheet.insertRule([
        ".message pre {",
        "font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, sans-serif;",
        "line-height: 1.3;",
        "background-color: rgb(228, 230, 232);",
        "padding: 12px;",
        "margin: 0;",
        "}"
    ].join("\n"));

    sheet.insertRule([
        ".message.editing .content, #input.editing {",
        "background: rgb(86, 88, 90) !important;",
        "}"
    ].join("\n"));

    sheet.insertRule([
        ".message.editing code, .message.editing pre {",
        "background-color: rgb(22, 24, 26);",
        "}"
    ].join("\n"));
})();
