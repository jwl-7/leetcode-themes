async function onLoad() {
    // const [tab] = await getActiveTab()

    // if (tab && tab.url && tab.url.startsWith(LEETCODE_URL)) {
    //     displayLoading()
    //     await loadThemeName()
    //     await loadPopupThemeSwitch()
    //     await loadMonacoThemeSwitch()
    //     await loadLeetCodeThemeSwitch()
    //     await loadLeetCodeResetSwitch()
    // } else {
    //     displayError()
    //     popupThemeSwitch.disabled = true
    //     leetCodeThemeSwitch.disabled = true
    //     leetCodeResetSwitch.disabled = true
    //     monacoThemeSwitch.disabled = true
    // }
    displayLoading()
    await loadThemeName()
    await loadPopupThemeSwitch()
    await loadMonacoThemeSwitch()
    await loadLeetCodeThemeSwitch()
    await loadLeetCodeResetSwitch()
}

async function loadThemeName() {
    const themeName = await getMonacoThemeName()
    displayThemeName(themeName)
}

async function loadPopupThemeSwitch() {
    const theme = await getPopupTheme()
    const htmlElement = document.documentElement

    popupThemeSwitch.checked = theme === 'dark'
    htmlElement.setAttribute('data-theme', theme)
}

async function loadLeetCodeThemeSwitch() {
    const theme = await getLeetCodeTheme()
    leetCodeThemeSwitch.checked = theme === 'dark'
}

async function loadLeetCodeResetSwitch() {
    const enableReset = await getLeetCodeReset()
    leetCodeResetSwitch.checked = enableReset
}

async function loadMonacoThemeSwitch() {
    const enableTheme = await getEnableMonacoTheme()
    monacoThemeSwitch.checked = enableTheme
}

async function onPopupThemeChange(event) {
    const checkbox = event.target
    const theme = checkbox.checked ? 'dark' : 'light'

    document.documentElement.setAttribute('data-theme', theme)
    await browser.runtime.sendMessage({
        command: POPUP_THEME_COMMAND,
        theme: theme
    })
}

async function onLeetCodeThemeChange(event) {
    const checkbox = event.target
    const theme = checkbox.checked ? 'dark' : 'light'

    await browser.runtime.sendMessage({
        command: LEETCODE_THEME_COMMAND,
        theme: theme
    })
}

async function onLeetCodeResetChange(event) {
    const checkbox = event.target
    const enableReset = checkbox.checked ? true : false

    await browser.runtime.sendMessage({
        command: LEETCODE_RESET_COMMAND,
        enable: enableReset
    })
}

async function onEnableMonacoThemeChange(event) {
    const checkbox = event.target
    const enableTheme = checkbox.checked ? true : false

    await browser.runtime.sendMessage({
        command: ENABLE_MONACO_THEME_COMMAND,
        enable: enableTheme
    })
}

async function onMonacoThemeChange() {
    const themeDisplayName = formatThemeName(themeSelector.value)

    displayThemeName(themeDisplayName)
    await browser.runtime.sendMessage({
        command: MONACO_THEME_COMMAND,
        themeName: themeDisplayName
    })
}


document.addEventListener('DOMContentLoaded', onLoad)
popupThemeSwitch.addEventListener('change', onPopupThemeChange)
monacoThemeSwitch.addEventListener('change', onEnableMonacoThemeChange)
leetCodeThemeSwitch.addEventListener('change', onLeetCodeThemeChange)
leetCodeResetSwitch.addEventListener('change', onLeetCodeResetChange)
themeSelector.addEventListener('change', onMonacoThemeChange)
