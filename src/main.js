const {
    app,
    BrowserWindow,
    ipcMain,
    Tray,
    Menu,
    session
} = require("electron");
const fs = require('fs');
const path = require('path');
const {
    Localization
} = require('./i18n.js');
const package = require('../package.json');
const osLang = global.osLang = Intl.DateTimeFormat().resolvedOptions().locale;
const locale = global.locale = new Localization(osLang);

const {
    loadAdBlockerEngine
} = require('./adBlock.js');

global.isExit = false;

const toPage = global.toPage = (path) => {
    mainWin.show();
    mainWin.moveTop();
    mainWin.loadURL("https://music.youtube.com/" + path);
}

const submenu = [
    {
        // Home
        label: locale.getLocation("default.menu.home"),
        click: () => {
            toPage("");
        }
    },
    {
        // Explore
        label: locale.getLocation("default.menu.explore"),
        click: () => {
            toPage("explore");
        }
    },
    {
        label: "",
        type: "separator"
    },
    {
        // Favorite
        label: locale.getLocation("default.menu.favorite"),
        click: () => {
            toPage("playlist?list=LM");
        }
    },
    {
        // History
        label: locale.getLocation("default.menu.history"),
        click: () => {
            toPage("history");
        }
    },
    {
        // Playlist
        label: locale.getLocation("default.menu.playlist"),
        click: () => {
            toPage("playlist");
        }
    },
    {
        label: "",
        type: "separator"
    },
    {
        // Exit
        label: locale.getLocation("default.menu.quit"),
        click: () => {
            isExit = true;
            mainWin.close();
            app.quit();
        }
    }
];

function createWindow() {
    var win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'),
            // contextIsolation: false,
        },
        show: false
    });

    var menu = Menu.buildFromTemplate([{
        label: locale.getLocation("default.menu"),
        submenu: submenu
    }]);

    win.webContents.userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0 YTMusic-Client/${package.version}`;

    // var tray = mainWindow.tray = new Tray();

    win.setMenu(menu);
    win.loadURL("https://music.youtube.com/");

    win.on("close", (event) => {
        if (!isExit) {
            event.preventDefault();
            win.hide();
        }
    });

    win.webContents.on("did-finish-load", () => {
        win.webContents.executeJavaScript(fs.readFileSync("./src/webScript.js", "utf8"));
    })
    win.on("ready-to-show", () => {
        win.show();
    })

    win.webContents.openDevTools();

    return win;
};

app.once('ready', () => {
    const mainWin = global.mainWin = createWindow();
    const mainSession = global.mainSession = session.defaultSession;

    loadAdBlockerEngine(mainSession);
});

app.setAppUserModelId(package.packageName);