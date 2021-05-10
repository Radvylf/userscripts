// ==UserScript==
// @name         Custom Fonts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows customization of the fonts on Stack Exchange
// @author       Redwolf Programs
// @match        https://stackexchange.com/*
// @match        https://*.stackexchange.com/*
// @match        https://stackoverflow.com/*
// @match        https://superuser.com/*
// @match        https://serverfault.com/*
// @match        https://stackapps.com/*
// @match        https://askubuntu.com/*
// @match        https://mathoverflow.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
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

    style.textContent = ("body{ " +
        ([
            ["--ff-sans", sans], ["--ff-serif", serif], ["--ff-mono", mono], ["--theme-body-font-family", theme]
        ].filter(r => r[1]).map(r => r[0] + ": " + r[1] + " !important; ")).join("") +
        "--theme-question-body-font-family: var(--theme-body-font-family) !important; " +
        "--theme-question-title-font-family: var(--theme-body-font-family) !important; " +
        "}"
    );

    try {
        document.head.appendChild(style);
    } catch (e) {
        document.addEventListener("DOMContentLoaded", () => {
            document.head.appendChild(style);
        });
    }
})();
