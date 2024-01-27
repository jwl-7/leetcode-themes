const popupMessage = document.getElementById('popup-message')
const errorMessage = popupMessage.querySelector('#error-message')
const loadingMessage = popupMessage.querySelector('#loading-message')
const themeMessage = popupMessage.querySelector('#theme-message')
const selectedTheme = themeMessage.querySelector('#selected-theme')
const themeSelector = document.getElementById('theme-selector')


async function getActiveTab() {
    return await browser.tabs.query({ currentWindow: true, active: true })
}

function displayLoading() {
    errorMessage.style.display = 'none'
    loadingMessage.style.display = 'block'
    themeMessage.style.display = 'none'
    themeSelector.disabled = false
}

function displayThemeName() {
    const monacoTheme = localStorage.getItem(THEME_KEY)

    errorMessage.style.display = 'none'
    loadingMessage.style.display = 'none'
    themeMessage.style.display = 'block'
    selectedTheme.innerHTML = monacoTheme ?? 'None'
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
    const formattedTheme = formatThemeDisplayName(themeName)

    localStorage.setItem(THEME_KEY, formattedTheme)
    await executeThemeCommand(formattedTheme)
    displayThemeName()
}

async function onLoad() {
    const [tab] = await getActiveTab()

    if (tab && tab.url && tab.url.startsWith(LEETCODE_URL)) {
        displayLoading()
        displayThemeName()
    } else {
        displayError()
    }
}

async function onThemeChange() {
    await setTheme(themeSelector.value)
}


document.addEventListener('DOMContentLoaded', onLoad)
themeSelector.addEventListener('change', onThemeChange)
