import { shell, ipcRenderer } from 'electron';
import * as isDev from 'electron-is-dev';

const linkOutput = document.getElementById('link-output');
const protocolUrl = document.getElementsByClassName('protocol-url');
const copyTerminal = document.getElementById('copy-terminal');
const terminalFeedback = document.getElementById('terminal-feedback');
const copyBrowser = document.getElementById('copy-browser');
const browserFeedback = document.getElementById('browser-feedback');
const pathInput = <HTMLInputElement>document.getElementById('path-input');
const openExternal = document.getElementById('open-external');
const environment = document.getElementById('environment');
const logfile = document.getElementById('logfile');
let protocolValue = '';
let pathValue = '';

if (environment) {
    environment.innerHTML = isDev ? 'development' : 'production';
}

if (linkOutput) {
    ipcRenderer.on('received-link', (event, link) => {
        linkOutput.innerHTML = link;
    });
}

ipcRenderer.on('set-protocol', (event, protocol) => {
    setProtocolValue(protocol);
});

if (logfile) {
    ipcRenderer.on('set-logfile', (event, file) => {
        logfile.innerHTML = file;
    });
}

if (pathInput) {
    pathInput.onchange = ({ target }) => {
        const { value } = <HTMLInputElement>target;
     
        setProtocolValue(protocolValue, value);
    };
}

if (openExternal) {
    openExternal.onclick = () => {
        shell.openExternal(`${protocolValue}://${pathValue}`);
    };
}

if (copyTerminal && terminalFeedback) {
    copyTerminal.onclick = () => {
        navigator.clipboard.writeText(`${protocolValue}://${pathValue}`).then(() => {
            terminalFeedback.innerHTML = 'copied!';

            setTimeout(() => {
                terminalFeedback.innerHTML = '';
            }, 2000);
        });
    };
}

if (copyBrowser && browserFeedback) {
    copyBrowser.onclick = () => {
        navigator.clipboard.writeText(`${protocolValue}://${pathValue}`).then(() => {
            browserFeedback.innerHTML = 'copied!';

            setTimeout(() => {
                browserFeedback.innerHTML = '';
            }, 2000);
        });
    };
}

function setProtocolValue(protocol: string, path = 'test/me') {
    protocolValue = protocol;
    pathValue = path;

    pathInput.value = path;

    for (let index = 0; index < protocolUrl.length; index++) {
        protocolUrl[index].innerHTML = `${protocol}://${path}`;
    }
}
