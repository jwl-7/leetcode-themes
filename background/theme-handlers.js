async function onPopupThemeCommand(message) {
    const theme = message.theme
    await storePopupTheme(theme)
}

async function onEnableMonacoThemeCommand(message) {
    const enableTheme = message.enable
    await storeEnableMonacoTheme(enableTheme)

    if (enableTheme) {
        const themeName = await getMonacoThemeName()
        const theme = await getMonacoTheme(themeName)
        const rawThemeName = await getRawThemeName(themeName)

        await sendMonacoThemeResponse(theme, rawThemeName)
    } else {
        const theme = await getLeetCodeTheme()
        await sendDefaultMonacoThemeResponse(theme)
    }
}

async function onMonacoThemeCommand(message) {
    const enableTheme = await getEnableMonacoTheme()
    const themeName = message.themeName
    const theme = await getMonacoTheme(themeName)
    const themeBackground = theme.colors['editor.background']

    await storeMonacoTheme(themeName, themeBackground)

    if (enableTheme) {
        const rawThemeName = await getRawThemeName(themeName)
        await sendMonacoThemeResponse(theme, rawThemeName)
    }
}

async function onLeetCodeThemeCommand(message) {
    const enableTheme = await getEnableMonacoTheme()
    const theme = message.theme

    await storeLeetCodeTheme(theme)
    await sendLeetCodeThemeResponse(theme)

    if (enableTheme) {
        const themeName = await getMonacoThemeName()
        const theme = await getMonacoTheme(themeName)
        const rawThemeName = await getRawThemeName(themeName)

        await sendMonacoThemeResponse(theme, rawThemeName)
    }
}

async function onLeetCodeResetCommand(message) {
    const enableReset = message.enable
    await storeLeetCodeReset(enableReset)
}

async function sendLeetCodeThemeResponse(theme) {
    const [tab] = await getActiveTab()
    const sendMessage = (theme) => {
        window.postMessage({
            command: LEETCODE_THEME_COMMAND,
            theme: theme
        })
    }

    await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: sendMessage,
        args: [theme]
    })
}

async function sendMonacoThemeResponse(theme, themeName) {
    const [tab] = await getActiveTab()
    const sendMessage = (theme, themeName) => {
        window.postMessage({
            command: MONACO_THEME_COMMAND,
            theme: theme,
            themeName: themeName,
        })
    }

    await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: sendMessage,
        args: [theme, themeName]
    })
}

async function sendDefaultMonacoThemeResponse(theme) {
    const [tab] = await getActiveTab()
    const sendMessage = (theme) => {
        window.postMessage({
            command: DEFAULT_MONACO_THEME_COMMAND,
            theme: theme
        })
    }

    await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: sendMessage,
        args: [theme]
    })
}
