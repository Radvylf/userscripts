// ==UserScript==
// @name         New Posts
// @namespace    http://tampermonkey.net/
// @version      0.8.6
// @description  Watches for new questions and answers
// @author       Redwolf Programs
// @match        https://codegolf.stackexchange.com/posts/new
// @match        https://codegolf.meta.stackexchange.com/posts/new
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    var SECONDS = 1000, MINUTES = 60 * SECONDS, HOURS = 60 * MINUTES, DAYS = 24 * HOURS, NEVER = Infinity, UNLIMITED = Infinity;

    var SITE_NAME = location.href.match(/https:\/\/(.*)\.stackexchange\.com/)[1];

    var DISCARD_AFTER = NEVER;
    var MAXIMUM_POSTS = UNLIMITED;
    var INSERT_BEFORE = true;

    var FORMAT_TIME = (time) => {
        if (time < MINUTES)
            return "Now";
        if (time < HOURS)
            return (time / MINUTES | 0) + "m";
        if (time < DAYS)
            return (time / HOURS | 0) + "h";

        return (time / DAYS | 0) + "d";
    };

    var FORMAT_OWNER = (owner) => {
        var un_html = (string) => new DOMParser().parseFromString(string, "text/html").documentElement.textContent;

        return un_html(owner.display_name) + (owner.user_type == "moderator" ? " ♦" : "");
    };

    var FORMAT_QUESTION = (question) => {
        var un_html = (string) => new DOMParser().parseFromString(string, "text/html").documentElement.textContent;

        var li = document.createElement("li");

        var a = document.createElement("a");
        var br = document.createElement("br");
        var p = document.createElement("p");

        var time = document.createElement("span");
        var owner = document.createElement("a");

        time.setAttribute("data-time", question.creation_date);

        a.textContent = un_html(question.title);
        a.href = question.link;
        a.target = "_blank";

        owner.textContent = FORMAT_OWNER(question.owner);
        owner.href = question.owner.link;
        owner.target = "_blank";

        p.appendChild(time);
        p.appendChild(document.createTextNode(" - "));
        p.appendChild(owner);
        p.appendChild(document.createTextNode(" (" + [...[...String(question.owner.reputation)].reverse().join("").match(/.{1,3}/g).join(",")].reverse().join("") + ")"));

        a.style.lineHeight = "1.5";
        p.style.lineHeight = "1.5";

        li.appendChild(a);
        li.appendChild(br);
        li.appendChild(p);

        return li;
    };

    var FORMAT_ANSWER = (question, answer) => {
        var un_html = (string) => new DOMParser().parseFromString(string, "text/html").documentElement.textContent;

        var li = document.createElement("li");

        var a = document.createElement("a");
        var br = document.createElement("br");
        var p = document.createElement("p");

        var preview = document.createTextNode("");
        var time = document.createElement("span");
        var owner = document.createElement("a");

        var dom = document.createElement("div");

        dom.innerHTML = answer.body;

        if (dom.children[0].tagName.match(/^H.|B$/))
            preview.textContent = dom.children[0].textContent.slice(0, 100) + (dom.children[0].textContent.length > 100 ? "..." : "") + "\n";

        time.setAttribute("data-time", answer.creation_date);

        a.textContent = un_html(question.title);
        a.href = answer.link;
        a.target = "_blank";

        owner.textContent = FORMAT_OWNER(answer.owner);
        owner.href = answer.owner.link;
        owner.target = "_blank";

        p.appendChild(preview);
        p.appendChild(time);
        p.appendChild(document.createTextNode(" - "));
        p.appendChild(owner);
        p.appendChild(document.createTextNode(" (" + [...[...String(answer.owner.reputation)].reverse().join("").match(/.{1,3}/g).join(",")].reverse().join("") + ")"));

        a.style.lineHeight = "1.5";
        p.style.lineHeight = "1.5";
        p.style.whiteSpace = "pre-wrap";

        li.appendChild(a);
        li.appendChild(br);
        li.appendChild(p);

        return li;
    };

    document.title = "New Posts - Code Golf and Coding Challenges";

    var grid, questions, answers;

    var observer = new MutationObserver((records) => {
        for (var i = 0; i < records.length; i++) {
            if (records[i].type == "childList" && records[i].target.parentNode && records[i].target.parentNode.querySelector(".grid.w100.h100")) {
                grid = document.querySelector(".grid.w100.h100");

                while (grid.firstChild)
                    grid.removeChild(grid.firstChild);

                var questions_parent = document.createElement("div");
                var answers_parent = document.createElement("div");

                var questions_title = document.createElement("h1");
                var answers_title = document.createElement("h1");

                questions_title.textContent = "Questions";
                answers_title.textContent = "Answers";

                questions_parent.appendChild(questions_title);
                answers_parent.appendChild(answers_title);

                questions = document.createElement("ul");
                answers = document.createElement("ul");

                questions_parent.appendChild(questions);
                answers_parent.appendChild(answers);

                questions_parent.className = "w50 h100";
                answers_parent.className = "w50 h100";

                questions_parent.style.padding = "24px";
                answers_parent.style.padding = "24px";

                grid.appendChild(questions_parent);
                grid.appendChild(answers_parent);

                observer.disconnect();

                break;
            }
        }
    });

    observer.observe(document, {attributes: false, childList: true, subtree: true});

    document.addEventListener("DOMContentLoaded", () => {
        window.addEventListener("focus", () => {
            document.title = "New Posts - Code Golf and Coding Challenges";
        });

        var update_time = (node) => {
            var difference = Date.now() - Number(node.getAttribute("data-time")) * 1000;

            if (difference > DISCARD_AFTER) {
                var ul = node, li;

                while (ul.tagName != "UL") {
                    li = ul;
                    ul = ul.parentNode;
                }

                ul.removeChild(li);

                if (document.title.match(/\d/)) {
                    var count = +(document.title.match(/\d+/g) || ["0"])[0] - 1;

                    document.title = (count > 0 ? "(" + count + ") " : "") + "New Posts - Code Golf and Coding Challenges";
                }

                return;
            }

            node.textContent = FORMAT_TIME(difference);
        };

        var update = () => {
            [...document.querySelectorAll("*[data-time]")].map(t => update_time(t));

            while (questions.children.length > MAXIMUM_POSTS)
                questions.removeChild(questions.children[MAXIMUM_POSTS]);

            while (answers.children.length > MAXIMUM_POSTS)
                answers.removeChild(answers.children[MAXIMUM_POSTS]);
        };

        var SITE_IDS = {
            "codegolf": 200,
            "codegolf.meta": 202
        };

        var previous_id = 0;

        var make_request = async (uri) => {
            return (await fetch(uri)).json();
        };

        var connect = async () => {
            var ws = new WebSocket("ws://qa.sockets.stackexchange.com/");

            ws.onopen = () => {
                ws.send(SITE_IDS[SITE_NAME] + "-questions-active");

                console.log("Opened");
            };

            ws.onmessage = async (info) => {
                var ws_json = JSON.parse(info.data);

                if (ws_json.action == "hb")
                    return ws.send("hb");

                ws_json.data = JSON.parse(ws_json.data);

                var dom_thing = document.createElement("div");

                dom_thing.innerHTML = ws_json.data.body;

                var action = dom_thing.querySelector(".started-link").childNodes[0].textContent.trim();

                console.log(action);

                if (action != "asked" && action != "answered")
                    return;

                if (!document.hasFocus())
                    document.title = "(" + (+(document.title.match(/\d+/g) || ["0"])[0] + 1) + ") New Posts - Code Golf and Coding Challenges";

                var question_json;

                for (var i = 0; i <= 10; i++) {
                    console.log(i);

                    question_json = await make_request("https://api.stackexchange.com/2.2/questions/" + ws_json.data.id + "?site=" + SITE_NAME + "&filter=!)5aShmihV3a6rrL*S-qf)i*WU5AL&key=OBN1dIUJujdeMOEvyA3Zhg((");

                    if (question_json.items.length)
                        break;

                    await new Promise(r => setTimeout(r, i < 4 ? 2500 : 10000));
                }

                if (!question_json.items.length)
                    throw "Could not obtain question info after ten attempts";

                console.log(question_json.items[0]);

                if (action == "answered") {
                    console.log("answer");

                    var answers_json;

                    for (var i = 0; i <= 10; i++) {
                        answers_json = await make_request("https://api.stackexchange.com/2.2/questions/" + ws_json.data.id + "/answers?site=" + SITE_NAME + "&sort=creation&order=desc&pagesize=1&filter=!LhHi1tBzB(YUIE7ecp6bVH&key=OBN1dIUJujdeMOEvyA3Zhg((");

                        if (answers_json.items.length && answers_json.items[0].answer_id > previous_id)
                            break;

                        await new Promise(r => setTimeout(r, i < 4 ? 2500 : 10000));
                    }

                    if (!answers_json.items.length || answers_json.items[0].answer_id <= previous_id)
                        throw "Could not obtain answer info after ten attempts, or answer is too old";

                    previous_id = answers_json.items[0].answer_id;

                    if (INSERT_BEFORE)
                        answers.prepend(FORMAT_ANSWER(question_json.items[0], answers_json.items[0]));
                    else
                        answers.append(FORMAT_ANSWER(question_json.items[0], answers_json.items[0]));
                } else {
                    console.log(FORMAT_QUESTION(question_json.items[0]));

                    if (INSERT_BEFORE)
                        questions.prepend(FORMAT_QUESTION(question_json.items[0]));
                    else
                        questions.append(FORMAT_QUESTION(question_json.items[0]));
                }

                update();
            };

            ws.onclose = () => {
                console.log("Closed");

                setTimeout(connect, 2000);
            };
        };

        connect();

        setInterval(update, 10000);
    });
})();
