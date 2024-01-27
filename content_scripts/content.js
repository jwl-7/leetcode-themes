const BASE_URL = 'https://leetcode.com'
const THEME_SWITCH = 'SWITCH_MONACO_THEME'
const THEME_COMMAND = 'SET_MONACO_THEME'
const THEME_LOAD = 'LOAD_MONACO_THEME'
const THEME_RESPONSE = 'SET_MONACO_THEME_RESPONSE'


function sendThemeCommand(themeName) {
    window.postMessage({
        command: THEME_COMMAND,
        themeName: themeName
    })
}

function sendLoadCommand() {
    window.postMessage({
        command: THEME_LOAD
    })
}

function applyTheme(themeName, theme) {
    if (typeof monaco !== 'undefined') {
        monaco.editor.defineTheme(themeName, theme)
        monaco.editor.setTheme(themeName)
    }
}

function onLoad() {
    if (typeof monaco !== 'undefined') {
        sendLoadCommand()
        return
    }
    setTimeout(onLoad, 100)
}

async function onMessage(event) {
    if (
        event.origin === BASE_URL &&
        event.data.command &&
        event.data.theme ||
        event.data.themeName
    ) {
        const theme = event.data.theme
        const themeName = event.data.themeName

        if (event.data.command === THEME_SWITCH) {
            sendThemeCommand(themeName)
        }
        if (event.data.command === THEME_RESPONSE) {
            applyTheme(themeName, theme)
        }
    }
}


window.addEventListener('message', onMessage)
onLoad()
