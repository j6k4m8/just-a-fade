const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const DURATION = 1.5 * HOUR;
const REFRESH_DURATION = 1 * SECOND;

let currentHost = window.top.location.host;

chrome.storage.sync.set({ "jaf_usage": undefined }, refreshJAF);

document.body.innerHTML = `
<progress id="__jaf_progress" value="0" max="100" style="position: fixed;
    z-index: 9999;
    width: 100vw;" onclick="resetJAF()"></progress>
` + document.body.innerHTML;


function resetJAF() {
    chrome.storage.sync.set({
        "durationRemaining": DURATION,
        "refreshDuration": REFRESH_DURATION,
        "duration": DURATION,
        "lastSet": new Date() * 1,
    }, () => { });
}


function refreshJAF() {
    window.setTimeout(() => {

        chrome.storage.sync.get(["durationRemaining", "refreshDuration", "duration"], function (result) {

            let duration = result.duration || DURATION;
            let durationRemaining = result.durationRemaining || DURATION;
            let refreshDuration = result.refreshDuration || REFRESH_DURATION;
            let lastSet = result.lastSet || new Date() * 1;

            if ((new Date() * 1) - lastSet > 6 * HOUR) {
                console.log("Resetting JAF for today.")
                duration = DURATION;
                durationRemaining = duration;
            }

            durationRemaining -= refreshDuration;

            console.log(`You have ${durationRemaining / 1000} seconds remaining on this site (of ${duration/1000}).`);

            document.querySelectorAll("html")[0].style.opacity = (
                (
                    durationRemaining / duration
                )
            );
            document.querySelectorAll("#__jaf_progress")[0].value = (
                (
                    100 * durationRemaining / duration
                )
            );



            chrome.storage.sync.set({
                "durationRemaining": durationRemaining,
                "refreshDuration": refreshDuration,
                "duration": duration,
                "lastSet": lastSet,
            }, refreshJAF);

        });

    }, REFRESH_DURATION);
};

refreshJAF();
