const popupMessage = document.getElementById('popup-message')
const errorMessage = document.getElementById('error-message')
const loadingMessage = document.getElementById('loading-message')
const themeMessage = document.getElementById('theme-message')
const selectedTheme = document.getElementById('selected-theme')
const themeSelector = document.getElementById('theme-selector')
const popupThemeSwitch = document.getElementById('popup-theme-switch')
const monacoThemeSwitch = document.getElementById('monaco-theme-switch')
const leetCodeThemeSwitch = document.getElementById('leetcode-theme-switch')
const leetCodeResetSwitch = document.getElementById('leetcode-reset-switch')


async function getActiveTab() {
    return await browser.tabs.query({ currentWindow: true, active: true })
}

function displayLoading() {
    errorMessage.style.display = 'none'
    loadingMessage.style.display = 'block'
    themeMessage.style.display = 'none'
    themeSelector.disabled = false
}

function displayThemeName(themeName) {
    errorMessage.style.display = 'none'
    loadingMessage.style.display = 'none'
    themeMessage.style.display = 'block'
    selectedTheme.innerHTML = themeName ?? 'None'
}

function displayError() {
    errorMessage.style.display = 'block'
    loadingMessage.style.display = 'none'
    themeMessage.style.display = 'none'
    themeSelector.disabled = true
    errorMessage.innerHTML = 'LeetCode editor not detected'
}

function formatThemeDisplayName(themeName) {
    return themeName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

function sendThemeCommand(themeName) {
    window.postMessage({
        command: THEME_SWITCH,
        themeName: themeName
    })
}

function sendLeetCodeThemeCommand(theme) {
    window.postMessage({
        command: LEETCODE_THEME_COMMAND,
        theme: theme
    })
}

async function executeLeetCodeThemeCommand(theme) {
    const [tab] = await getActiveTab()

    if (tab && tab.url && tab.url.startsWith(LEETCODE_URL)) {
        await browser.scripting.executeScript({
            target: { tabId: tab.id },
            func: sendLeetCodeThemeCommand,
            args: [theme]
        })
    }
}

async function executeThemeCommand(themeName) {
    const [tab] = await getActiveTab()

    if (tab && tab.url && tab.url.startsWith(LEETCODE_URL)) {
        await browser.scripting.executeScript({
            target: { tabId: tab.id },
            func: sendThemeCommand,
            args: [themeName]
        })
    }
}

async function setTheme(themeName) {
    const themeDisplayName = formatThemeDisplayName(themeName)

    await executeThemeCommand(themeDisplayName)
    displayThemeName(themeDisplayName)
}

async function loadPopupThemeSwitch() {
    const { [POPUP_THEME_KEY]: theme } = await browser.storage.local.get(POPUP_THEME_KEY)
    const htmlElement = document.documentElement

    if (!theme) {
        await browser.storage.local.set({ [POPUP_THEME_KEY]: 'light' })
    } else if (theme === 'dark') {
        popupThemeSwitch.checked = true
        htmlElement.setAttribute('data-theme', theme)
    }
}

async function loadLeetCodeThemeSwitch() {
    const theme = localStorage.getItem(LEETCODE_THEME_KEY)
    const htmlElement = document.documentElement
    const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light'

    if (theme === 'dark') {
        leetCodeThemeSwitch.checked = true
    }
    if (currentTheme !== theme) {
        await executeLeetCodeThemeCommand(theme)
    }
}

async function loadMonacoThemeSwitch() {
    const { [ENABLE_MONACO_THEME_KEY]: enableTheme } = await browser.storage.local.get(ENABLE_MONACO_THEME_KEY)

    if (!enableTheme) {
        await browser.storage.local.set({ [ENABLE_MONACO_THEME_KEY]: false })
    } else {
        monacoThemeSwitch.checked = true
    }
}

async function onLoad() {
    const [tab] = await getActiveTab()
    const { [MONACO_THEME_KEY]: themeName } = await browser.storage.local.get(MONACO_THEME_KEY)

    if (tab && tab.url && tab.url.startsWith(LEETCODE_URL)) {
        displayLoading()
        displayThemeName(themeName)
        await loadPopupThemeSwitch()
        await loadLeetCodeThemeSwitch()
        await loadMonacoThemeSwitch()
    } else {
        displayError()
    }
}

async function onThemeChange() {
    await setTheme(themeSelector.value)
}

async function onPopupThemeChange(event) {
    const checkbox = event.target
    const theme = checkbox.checked ? 'dark' : 'light'

    document.documentElement.setAttribute('data-theme', theme)
    await browser.storage.local.set({ [POPUP_THEME_KEY]: theme })
}

async function onLeetCodeThemeChange(event) {
    const checkbox = event.target
    const theme = checkbox.checked ? 'dark' : 'light'

    await executeLeetCodeThemeCommand(theme)
}

async function onMonacoThemeChange(event) {
    const checkbox = event.target
    const theme = checkbox.checked ? true : false

    await browser.storage.local.set({ [ENABLE_MONACO_THEME_KEY]: theme })
}

function onLeetCodeResetChange(event) {
    return
}


document.addEventListener('DOMContentLoaded', onLoad)
themeSelector.addEventListener('change', onThemeChange)
popupThemeSwitch.addEventListener('change', onPopupThemeChange)
leetCodeThemeSwitch.addEventListener('change', onLeetCodeThemeChange)
monacoThemeSwitch.addEventListener('change', onMonacoThemeChange)
leetCodeResetSwitch.addEventListener('change', onLeetCodeResetChange)
