import { app, BrowserWindow } from 'electron';
import { Deeplink } from 'electron-deeplink';
import * as isDev from 'electron-is-dev';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

let mainWindow: BrowserWindow;
const protocol = isDev ? 'dev-app' : 'prod-app';
const deeplink = new Deeplink({ app, mainWindow, protocol, isDev, debugLogging: true });

deeplink.on('received', (link) => {
    mainWindow.webContents.send('received-link', link);
});

if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // mainWindow.webContents.openDevTools();

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('set-protocol', deeplink.getProtocol());
        mainWindow.webContents.send('set-logfile', deeplink.getLogfile());
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

