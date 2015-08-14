// ==UserScript==
// @name     Codingame File Sync
// @match    *://code.codingame.com/*
// @version  1.0
// @grant    none
// ==/UserScript==

(function() {
    setInterval(function () {
        $("#inputParent > div.squareTitle > div.tools")
            .filter(function () {
                return !($(this).data("syncInputOk") === true);
            })
            .each(function () {
                $(this)
                    .data("syncInputOk", true)
                    .prepend("<div><form><input type=\"file\" class=\"syncInput\" /></form></div>");
            });

        $("#inputParent div.squareTitle > div.tools form > input.syncInput").each(function () {
            var reader = new FileReader();
            var parent = $(this).closest("#inputParent");
            var prevCode = parent.data("code") || "";

            if (this.files.length != 1) {
                return ;
            }

            reader.onloadend = function () {
                var code = reader.result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                var event = new CustomEvent('IDE_SendRequest', {
                    'detail': {
                        'status': "SendCodeViaPlugin",
                        'code': code
                    }
                });

                if (prevCode != code) {
                    $(window.top.document)
                        .find("#ideFrame")
                        .contents()[0]
                        .dispatchEvent(event);

                    parent.data("code", code);
                }
            };

            reader.readAsText(this.files[0]);
        });
    }, 1000);
})();
