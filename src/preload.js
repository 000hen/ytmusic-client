// window.chrome = {
//     runtime: {
//         getManifest: () => {
//             return {
//                 version: "ytmusic-client-version"
//             };
//         }
//     }
// };

// // Includes YouTube Nonstop Extension
// // Source: https://github.com/lawfx/YoutubeNonStop, License: MIT
// fetch("https://raw.githubusercontent.com/lawfx/YoutubeNonStop/master/autoconfirm.js").then(e => e.text()).then(e => {
//     eval(e);
// });
// const {
//     elements
// } = window.adData = require("./googleAdUrls.json");

// document.addEventListener("DOMNodeInserted", () => {
//     elements.forEach(ele => {
//         const elem = document.querySelector(ele);
//         if (elem) {
//             elem.remove();
//         }
//     })
// });