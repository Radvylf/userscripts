// ==UserScript==
// @name         Inbox Interrupt
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
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
// @exclude      https://api.stackexchange.com/*
// @exclude      https://chat.stackexchange.com/*
// @exclude      https://chat.meta.stackexchange.com/*
// @exclude      https://chat.stackoverflow.com/*
// @exclude      https://data.stackexchange.com/*
// @exclude      https://dev.stackexchange.com/*
// @exclude      https://openid.stackexchange.com/*
// @exclude      https://insights.stackoverflow.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
    var observer = new MutationObserver((records) => {
        var inbox = false;
        var achievements = false;

        for (var i = 0; i < records.length; i++) {
            if (records[i].type == "childList" && records[i].target.parentNode && records[i].target.parentNode.querySelector("a.js-inbox-button")) {
                records[i].target.parentNode.querySelector("a.js-inbox-button").href = "javascript:void(0)";

                inbox = true;

                if (achievements)
                    observer.disconnect();
            }

            if (records[i].type == "childList" && records[i].target.parentNode && records[i].target.parentNode.querySelector("a.js-achievements-button")) {
                records[i].target.parentNode.querySelector("a.js-achievements-button").href = "javascript:void(0)";

                achievements = true;

                if (inbox)
                    observer.disconnect();
            }
        }
    });

    observer.observe(document, {attributes: false, childList: true, subtree: true});
})();
