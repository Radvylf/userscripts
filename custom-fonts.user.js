// ==UserScript==
// @name         Custom Fonts
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Allows customization of the fonts on Stack Exchange
// @author       Redwolf Programs
// @match        https://stackexchange.com
// @match        https://stackexchange.com/*
// @match        https://*.stackexchange.com/*
// @match        https://stackoverflow.com/*
// @match        https://*.stackoverflow.com/*
// @match        https://superuser.com/*
// @match        https://*.superuser.com/*
// @match        https://serverfault.com/*
// @match        https://*.serverfault.com/*
// @match        https://stackapps.com/*
// @match        https://*.stackapps.com/*
// @match        https://askubuntu.com/*
// @match        https://*.askubuntu.com/*
// @match        https://mathoverflow.com/*
// @match        https://*.mathoverflow.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
    var Imports = ""; // "@import { /* I don't know how imports work */ }"

    var Rules = [
        {
            site: "https:", // Apply to all sites

            // sans: "Arial, \"Helvetica Neue\", Helvetica, sans-serif",
            // mono: "Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, sans-serif"
        }
    ];

    // Properties:
    //   sans: sans-serif fonts
    //   serif: serif fonts
    //   mono: monospace fonts
    //   theme: default font to use, one of:
    //     var(--ff-sans)
    //     var(--ff-serif)
    //     var(--ff-mono)

    var sans = null;
    var serif = null;
    var mono = null;
    var theme = null;

    for (var i = 0; i < Rules.length; i++) {
        if (!location.href.startsWith(Rules[i].site))
            continue;

        if (Rules[i].sans)
            sans = Rules[i].sans;
        if (Rules[i].serif)
            serif = Rules[i].serif;
        if (Rules[i].mono)
            mono = Rules[i].mono;
        if (Rules[i].theme)
            theme = Rules[i].theme;
    }

    if (!sans && !serif && !mono && !theme)
        return;

    var style = document.createElement("style");

    style.textContent = (
        Imports + (Imports && " ") + "body { " +
        ([
            ["--ff-sans", sans], ["--ff-serif", serif], ["--ff-mono", mono], ["--theme-body-font-family", theme]
        ].filter(r => r[1]).map(r => r[0] + ": " + r[1] + " !important; ")).join("") +
        "--theme-question-body-font-family: var(--theme-body-font-family) !important; " +
        "--theme-question-title-font-family: var(--theme-body-font-family) !important; " +
        "font-family: var(--theme-body-font-family) !important; " +
        "} " +
        [
            "body.channels-page .top-bar",
            ".container .chosen-container .chosen-choices li.search-choice",
            ".modal .modal-close", ".topbar-dialog", ".topbar-dialog .header h3",
            ".topbar-dialog .header h3 a", ".topbar-dialog .modal-content .message-text h4",
            ".topbar-dialog .pinned-site-editor-container .remove-pinned-site-link a",
            ".top-bar", "#user-menu", ".popup-close a", ".message.message-error .message-close",
            ".message.message-info .message-close", ".message.message-warning .message-close",
            ".message.message-config .message-close,.message.message-info.contributor-dropdown .message-close",
            ".message.message-success .message-close", ".answerBox .numAnswer", ".hotness-rank", ".statsBox .number",
            ".inputField", "input[type=submit],input[type=button],.btn", ".page-numbers", ".ac_results li", ".ac_over",
            ".siteSelect form select", ".statsBox .statsLink", ".sort a,.subtabs a", ".unreadCount", ".unreadCountTab",
            ".top-question-score-number", ".bookmark-number", ".account-container .account-stat .account-number",
            ".lv-stats-box .number", "#noscript-warning"
        ].map(c => "html " + c + " { font-family: var(--ff-sans) !important; }").join(" ") +
        [
            "pre.s-code-block", ".s-prose code", "pre", "code", ".CodeMirror",
            "textarea.wmd-input,textarea#wmd-input", ".full-diff .content"
        ].map(c => "html " + c + " { font-family: var(--ff-mono) !important; }").join(" ")
    );

    try {
        document.head.appendChild(style);
    } catch (e) {
        document.addEventListener("DOMContentLoaded", () => {
            document.head.appendChild(style);
        });
    }
})();
