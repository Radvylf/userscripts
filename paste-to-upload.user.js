// ==UserScript==
// @name         Paste to Upload
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Take over the world. Not try, I'm pretty confident in my abilities.
// @author       Radvylf, dictator of our world and fairly cool guy
// @match        https://chat.stackexchange.com/rooms/*
// @grant        none
// ==/UserScript==

(() => {
    var input = document.getElementById("input");

    input.addEventListener("paste", (info) => {
        if (info.clipboardData.files.length != 1 && !document.getElementById("upload-file").disabled)
            return;

        info.preventDefault();

        document.getElementById("upload-file").click();

        var files = info.clipboardData.files;

        setTimeout(() => {
            console.log(files);

            document.getElementById("filename-input").files = files;
            document.querySelector("div.wmd-prompt-dialog input[type=submit]").click();
        }, 0);
    });
})();
