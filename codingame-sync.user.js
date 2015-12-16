// ==UserScript==
// @name     Codingame File Sync
// @match    *://www.codingame.com/ide/*
// @version  1.1
// @grant    none
// ==/UserScript==

(function() {
    setInterval(function () {
        $(".code-buttons")
            .filter(function () {
                return !($(this).data("syncInputOk") === true);
            })
            .each(function () {
                $(this)
                    .data("syncInputOk", true)
                    .prepend("<div><form><input type=\"file\" class=\"syncInput\" /></form></div>");
            });

        $(".syncInput").each(function () {
            var reader = new FileReader();
            var prevCode = "";

            if (this.files.length != 1) {
                return ;
            }

            reader.onloadend = function () {
                var code = reader.result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                var event = new CustomEvent('ExternalEditorToIDE', {
                    'detail': {
                        'status': "updateCode",
                        'code': code
                    }
                });

                if (prevCode != code) {
                    window.document.dispatchEvent(event);

                    prevCode = code;
                }
            };

            reader.readAsText(this.files[0]);
        });
    }, 1000);
})();

