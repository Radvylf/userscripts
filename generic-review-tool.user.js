// ==UserScript==
// @name         Generic Review Tool
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Detects and opens review tasks
// @author       Redwolf Programs (Ryan Tosh)
// @match        https://codegolf.stackexchange.com/review
// @match        https://codegolf.stackexchange.com/review/*
// @grant        GM.openInTab
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==

(function() {
    var UPDATE_INTERVAL = 40000;

    if (location.pathname != "/review") {
        if (location.pathname.endsWith("/stats") || location.pathname.endsWith("/history"))
            return;

        var key = location.pathname.split("/").slice(1, 3).join("_").replace(/-/g, "_");

        console.log(key);

        setInterval(async () => {
            GM.setValue("GRT." + key, Date.now());
        }, 1000);

        return;
    }

    var main_reviews = Object.fromEntries([...document.querySelectorAll(".bb")].map(r => [r.querySelector(".mb2 a").href, r]));
    var main_numbers = {};

    var r;

    for (r in main_reviews)
        main_numbers[r] = main_reviews[r].querySelector(".fl-shrink0 > .fs-body3");

    var updated = Date.now();

    var counter = document.createElement("p");

    var counter_b = document.createElement("b");
    var counter_t = document.createTextNode("0:00");

    counter_b.textContent = "Previous Update: ";

    counter.appendChild(counter_b);
    counter.appendChild(counter_t);

    counter.style.margin = "0";
    counter.style.padding = "10px 10px 4px 10px";
    counter.style.color = "var(--fc-medium)";

    var total = document.createElement("p");

    var total_b = document.createElement("b");
    var total_t = document.createTextNode("0");

    total_b.textContent = "Pending Reviews: ";

    total.appendChild(total_b);
    total.appendChild(total_t);

    total.style.margin = "0";
    total.style.padding = "0 10px 0 10px";
    total.style.color = "var(--fc-medium)";

    [...document.querySelectorAll(".s-page-title--description")].map(n => n.parentNode.removeChild(n));

    document.querySelector(".s-page-title--text").appendChild(counter);
    document.querySelector(".s-page-title--text").appendChild(total);

    var start = Date.now();

    var update = async () => {
        if (navigator.onLine === false)
            return;

        var html = await fetch("/review").then(r => r.text());

        var body = html.match(/<body[^>]*>(.*)<\/body>/s)[1];

        var div = document.createElement("div");

        div.innerHTML = body;

        var reviews = Object.fromEntries([...div.querySelectorAll(".bb")].map(r => [r.querySelector(".mb2 a").href, r]));
        var data = {};

        for (r in reviews)
            data[r] = +reviews[r].querySelector(".fl-shrink0 > .fs-body3").textContent.match(/\d+/)[0];

        for (r in reviews) {
            main_numbers[r].textContent = main_numbers[r].title = data[r];

            if (data[r] && Date.now() - (await GM.getValue("GRT." + r.split(".com")[1].split("/").slice(1, 3).join("_").replace(/-/g, "_")) || 0) > 2500)
                GM.openInTab(r);
        }

        counter_t.textContent = "0:00";
        updated = Date.now();

        total_t.textContent = Object.entries(data).reduce((t, n) => t + n[1], 0);
    };

    setInterval(() => {
        var time = (Date.now() - updated) / 1000;

        counter_t.textContent = (time / 60 | 0) + ":" + (time % 60 | 0).toString().padStart(2, 0);
    }, 75);

    var timeout = -1;
    var started = -7500;

    var update_timeout = () => (Date.now() - started > (UPDATE_INTERVAL / 2 + 5000) / 2) ? (clearTimeout(timeout), update(), started = Date.now(), timeout = setTimeout(update_timeout, UPDATE_INTERVAL)) : null;

    window.onfocus = () => (Date.now() - updated > (UPDATE_INTERVAL / 2 + 10000) / 2) ? update_timeout() : null;

    update_timeout();
})();
