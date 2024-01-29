const popupMessage = document.getElementById('popup-message')
const errorMessage = document.getElementById('error-message')
const loadingMessage = document.getElementById('loading-message')
const themeMessage = document.getElementById('theme-message')
const selectedTheme = document.getElementById('selected-theme')
const themeSelector = document.getElementById('theme-selector')
const popupDarkModeSwitch = document.getElementById('popup-darkmode-switch')
const leetcodeDarkModeSwitch = document.getElementById('leetcode-darkmode-switch')
const leetcodeThemeSwitch = document.getElementById('leetcode-theme-switch')
const leetcodeCodeResetSwitch = document.getElementById('leetcode-code-reset-switch')


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
    const themeDisplayName = formatThemeDisplayName(themeSelector.value)

    await executeThemeCommand(themeDisplayName)
    displayThemeName(themeDisplayName)
}

async function onLoad() {
    const [tab] = await getActiveTab()
    const { [THEME_KEY]: themeName } = await browser.storage.local.get(THEME_KEY)

    if (tab && tab.url && tab.url.startsWith(LEETCODE_URL)) {
        displayLoading()
        displayThemeName(themeName)
        loadPopupDarkModeSwitch()
    } else {
        displayError()
    }
}

async function onThemeChange() {
    await setTheme(themeSelector.value)
}

async function onPopupDarkModeChange(event) {
    const checkbox = event.target
    const theme = checkbox.checked ? 'dark' : 'light'

    document.documentElement.setAttribute('data-theme', theme)

    await browser.storage.local.set({
        [POPUP_THEME_KEY]: theme
    })
}

async function loadPopupDarkModeSwitch() {
    const { [POPUP_THEME_KEY]: theme } = await browser.storage.local.get(POPUP_THEME_KEY)

    if (!theme) {
        await browser.storage.local.set({
            [POPUP_THEME_KEY]: 'light'
        })
    } else if (theme === 'dark') {
        popupDarkModeSwitch.checked = true
        document.documentElement.setAttribute('data-theme', theme)
    }
}

function onLeetcodeDarkModeChange(event) {
    return
}

function onLeetcodeThemeChange(event) {
    return
}

function onLeetcodeCodeResetChange(event) {
    return
}


document.addEventListener('DOMContentLoaded', onLoad)
themeSelector.addEventListener('change', onThemeChange)
popupDarkModeSwitch.addEventListener('change', onPopupDarkModeChange)
leetcodeDarkModeSwitch.addEventListener('change', onLeetcodeDarkModeChange)
leetcodeThemeSwitch.addEventListener('change', onLeetcodeThemeChange)
leetcodeCodeResetSwitch.addEventListener('change', onLeetcodeCodeResetChange)
