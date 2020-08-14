const { shell } = require('electron');
const isDev = require('electron-is-dev');
const linkOutput = document.getElementById('link-output');
const protocolUrl = document.getElementsByClassName('protocol-url');
const copyTerminal = document.getElementById('copy-terminal');
const terminalFeedback = document.getElementById('terminal-feedback');
const copyBrowser = document.getElementById('copy-browser');
const browserFeedback = document.getElementById('browser-feedback');
const pathInput = document.getElementById('path-input');
const openExternal = document.getElementById('open-external');
const environment = document.getElementById('environment');
const logfile = document.getElementById('logfile');
let protocolValue = '';
let pathValue = '';

environment.innerHTML = isDev ? 'development' : 'production';

require('electron').ipcRenderer.on('received-link', (event, link) => {
    linkOutput.innerHTML = link;
});

require('electron').ipcRenderer.on('set-protocol', (event, protocol) => {
    setProtocolValue(protocol);
});

require('electron').ipcRenderer.on('set-logfile', (event, file) => {
    logfile.innerHTML = file;
});

pathInput.onchange = ({ target }) => {
    setProtocolValue(protocolValue, target.value);
};

openExternal.onclick = () => {
    shell.openExternal(`${protocolValue}://${pathValue}`);
};

copyTerminal.onclick = () => {
    navigator.clipboard.writeText(`${protocolValue}://${pathValue}`).then(() => {
        terminalFeedback.innerHTML = 'copied!';

        setTimeout(() => {
            terminalFeedback.innerHTML = '';
        }, 2000);
    });
};

copyBrowser.onclick = () => {
    navigator.clipboard.writeText(`${protocolValue}://${pathValue}`).then(() => {
        browserFeedback.innerHTML = 'copied!';

        setTimeout(() => {
            browserFeedback.innerHTML = '';
        }, 2000);
    });
};

function setProtocolValue(protocol, path = 'test/me') {
    protocolValue = protocol;
    pathValue = path;

    pathInput.value = path;

    for (let index = 0; index < protocolUrl.length; index++) {
        protocolUrl[index].innerHTML = `${protocol}://${path}`;
    }
}
