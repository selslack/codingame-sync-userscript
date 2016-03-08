// ==UserScript==
// @name     Codingame File Sync
// @match    *://www.codingame.com/*
// @version  2.0
// @grant    none
// ==/UserScript==

(function() {
    'use strict';

    var input = null;
    var reader = new FileReader();

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i].nodeType !== 1) { // ELEMENT_NODE
                    continue ;
                }

                let buttons = mutation.addedNodes[i].querySelector("div.code-buttons");

                if (!buttons) {
                    continue ;
                }

                input = document.createElement("input");
                input.className = "ide-tab";
                input.type = "file";

                buttons.insertBefore(input, buttons.firstChild);
            }

            for (let i = 0; i < mutation.removedNodes.length; i++) {
                if (mutation.removedNodes[i].nodeType !== 1) { // ELEMENT_NODE
                    continue ;
                }

                if (!mutation.removedNodes[i].querySelector("div.code-buttons")) {
                    continue ;
                }

                input = null;
            }
        });
    });

    var sync = function () {
        if (!input || input.files.length !== 1) {
            return ;
        }

        try {
            reader.readAsText(input.files[0]);
        }
        catch (e) {
            // Safely ignore any error
        }
    };

    reader.onloadend = function (event) {
        window.document.dispatchEvent(new CustomEvent("ExternalEditorToIDE", {
            detail: {
                status: "updateCode",
                code: event.target.result.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
            }
        }));
    };

    observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: false,
        characterData: false
    });

    setInterval(sync, 1000);
})();
