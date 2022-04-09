// From: https://github.com/th-ch/youtube-music/blob/master/plugins/adblocker/blocker.js

const {
    ElectronBlocker
} = require("@cliqz/adblocker-electron");
const fetch = require("node-fetch");

const SOURCES = [
    "https://raw.githubusercontent.com/kbinani/adblock-youtube-ads/master/signed.txt",
    // uBlock Origin
    "https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt",
    "https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters-2021.txt",
    // Fanboy Annoyances
    "https://secure.fanboy.co.nz/fanboy-annoyance_ubo.txt",
];

const loadAdBlockerEngine = (
    session = undefined,
    additionalBlockLists = [],
    disableDefaultLists = false
) => {
    const lists = [
        ...(disableDefaultLists ? [] : SOURCES),
        ...additionalBlockLists,
    ];

    ElectronBlocker.fromLists(
            fetch,
            lists, {
                // when generating the engine for caching, do not load network filters
                // So that enhancing the session works as expected
                // Allowing to define multiple webRequest listeners
                loadNetworkFilters: session !== undefined,
            }
        )
        .then((blocker) => {
            if (session) {
                console.log("[AdBlocker] Adding AdBlocker to session");
                blocker.enableBlockingInSession(session);
            } else {
                console.log("Successfully generated adBlocker engine.");
            }
        })
        .catch((err) => console.log("Error loading adBlocker engine", err));
};

module.exports = {
    loadAdBlockerEngine
};