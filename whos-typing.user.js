// ==UserScript==
// @name         Who's Typing
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Shows who's typing in SE cat
// @author       Radvylf Programs
// @match        https://chat.stackexchange.com/rooms/*
// @grant        none
// ==/UserScript==

(async () => {
    const POSITIONING = 0; // 0: On top; 1: To right
    const LOCALHOST = 0;

    var ids = new Map();
    var typing = new Map();
    var brcast = null;
    var sync = 0;

    var room = (location.href.match(/^https:\/\/chat\.stackexchange\.com\/rooms\/(\d+)/) || [])[1];
    var user_id = ([...((document.querySelector("#active-user") || {}).classList || [])].find(c => c.match(/^user-\d+$/)) || "").slice(5);
    var user_name = document.querySelector("#active-user .avatar img").title;

    if (!room || !user_id)
        return;

    var who_typing = document.createElement("div");

    who_typing.style.fontSize = "12px";
    who_typing.style.lineHeight = "1.25";
    who_typing.style.fontWeight = "bold";
    who_typing.style.whiteSpace = "pre-wrap";

    if (POSITIONING == 0) {
        document.querySelector("#input-area").insertBefore(who_typing, document.querySelector("#input-area").firstChild);

        who_typing.style.position = "absolute";
        who_typing.style.top = "-27px";
        who_typing.style.left = "82px";
        who_typing.style.padding = "6px";

        who_typing.style.color = "#000000";
        who_typing.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
    } else {
        document.querySelector("#chat-buttons").appendChild(who_typing);

        who_typing.style.color = "#ffffff";
        who_typing.style.margin = "5px";
    }

    var show_typing = () => {
        var typing_ids = [];
        var tick = Infinity;
        var now = Date.now() - sync;

        for (var id of [...typing].sort((a, b) => a[1][1] - b[1][1])) {
            if (now < id[1][0] + 2000) {
                typing_ids.push(id[0]);

                tick = Math.min(tick, (id[1][0] + 2000) - now);
            }
        }

        var names = typing_ids.map(i => ids.get(i).replace(/[\u0000-\u002f\u003a-\u0040\u005b-\u0060\u007b-\u00ff]/g, c => "&#" + ("000" + c.charCodeAt(0)).slice(-4) + ";") || "<i>user" + i + "</i>");

        if (typing_ids.length == 0) {
            who_typing.textContent = "";
        } else if (typing_ids.length == 1) {
            who_typing.innerHTML = names[0] + " is typing...";
        } else if (typing_ids.length == 2) {
            who_typing.innerHTML = names[0] + " and " + names[1] + " are typing...";
        } else {
            who_typing.innerHTML = names[0] + " and " + (names.length - 1) + " others are typing.";
        }

        if (brcast) {
            if (now >= brcast[1] + 20000) {
                brcast = null;
            } else {
                who_typing.textContent = brcast[0];

                tick = (Date.now() + 20000) - brcast[1];
            }
        }

        if (tick != Infinity)
            setTimeout(show_typing, tick);
    };

    var ws;

    var start_ws = async (fails = 0) => {
        try {
            ws = new WebSocket(LOCALHOST ? "ws://localhost:8077" : "wss://rydwolf.xyz/whos_typing");

            ws.onopen = () => {
                ws.send("id\n" + Date.now() + "\n" + room + "\n" + user_id + ":" + JSON.stringify(user_name));
            };

            ws.onmessage = async (info) => {
                var data = info.data.split("\n");

                console.log(data);

                if (data[1]) {
                    sync = +data[1].split(" ")[1] - (+data[1].split(" ")[0] + Date.now()) / 2 | 0;

                    console.log(sync);
                }

                var id;

                if (!data[0]) {
                    var i = 0;

                    for (id of data.slice(2))
                        typing.set(id.split(":")[0], [+id.split(":")[1], i++]);

                    show_typing();
                } else if (data[0] == "id") {
                    for (id of data.slice(2))
                        ids.set(id.split(":")[0], JSON.parse(id.split(":").slice(1).join(":")));
                } else if (data[0] == "sync") {
                } else if (data[0] == "brcast") {
                    brcast = [data.slice(3).join("\n"), Date.now()];

                    show_typing();
                }
            };

            ws.onclose = (...info) => {
                setTimeout(start_ws, fails < 4 ? 100 * 2 ** fails : fails < 8 ? 1000 * 2 ** (fails - 4) : 12000, fails + 1);
            };
        } catch (info) {
            setTimeout(start_ws, fails < 4 ? 100 * 2 ** fails : fails < 8 ? 1000 * 2 ** (fails - 4) : 12000, fails + 1);
        }
    };

    start_ws();

    var status = 0;
    var from = null;

    var from_to_ws = () => {
        if (from == null) {
            status = 0;

            return;
        }

        if (ws && ws.readyState == 1)
            ws.send("\n" + Date.now() + "\n" + (Date.now() - sync));

        from = null;

        setTimeout(from_to_ws, 1000);
    };

    document.querySelector("#input").addEventListener("input", () => {
        if (document.querySelector("#input").value.length) {
            if (status == 0) {
                if (ws && ws.readyState == 1)
                    ws.send("\n" + Date.now() + "\n" + (Date.now() - sync));

                status = 1;
                from = null;
                setTimeout(from_to_ws, 1000);
            } else if (status == 1) {
                from = Date.now() + sync;
            }
        }
    }, false);
})();
