const BASE_URL = 'https://leetcode.com'
const MONACO_THEME_COMMAND = 'SET_MONACO_THEME'
const DEFAULT_MONACO_THEME_COMMAND = 'SET_DEFAULT_MONACO_THEME'
const LEETCODE_THEME_COMMAND = 'SET_LEETCODE_THEME'
const LEETCODE_THEME_KEY = 'lc-dark-side'
const DEFAULT_MONACO_THEME = 'vs'
const DEFAULT_MONACO_DARK_THEME = 'vs-dark'


function applyTheme(message) {
    if (typeof monaco !== 'undefined') {
        const theme = message.data.theme
        const themeName = message.data.themeName

        monaco.editor.defineTheme(themeName, theme)
        monaco.editor.setTheme(themeName)
    }
}

function applyDefaultTheme(message) {
    if (typeof monaco !== 'undefined') {
        const theme = message.data.theme === 'light'
            ? DEFAULT_MONACO_THEME
            : DEFAULT_MONACO_DARK_THEME

        monaco.editor.setTheme(theme)
    }
}

function applyLeetCodeTheme(message) {
    const theme = message.data.theme
    const storageEvent = new StorageEvent('storage', {
        key: LEETCODE_THEME_KEY,
        newValue: theme
    })

    localStorage.setItem(LEETCODE_THEME_KEY, theme)
    window.dispatchEvent(storageEvent)
}

function onMessage(message) {
    if (message.origin === BASE_URL) {
        if (message.data.command === MONACO_THEME_COMMAND) {
            applyTheme(message)
        }
        if (message.data.command === LEETCODE_THEME_COMMAND) {
            applyLeetCodeTheme(message)
        }
        if (message.data.command === DEFAULT_MONACO_THEME_COMMAND) {
            applyDefaultTheme(message)
        }
    }
}


window.addEventListener('message', onMessage)
