async function getData(url) {
    const response = await fetch(url)
    return response.json()
}

function sendThemeCommand(themeName) {
    window.postMessage({
        command: THEME_COMMAND,
        themeName: themeName
    })
}

function sendThemeResponse(theme, themeName) {
    window.postMessage({
        command: THEME_RESPONSE,
        theme: theme,
        themeName: themeName,
    })
}

async function storeTheme(themeName, themeBackground) {
    await browser.storage.local.set({
        [MONACO_THEME_KEY]: themeName,
        [MONACO_BACKGROUND_KEY]: themeBackground
    })
}

async function onMessage(event) {
    if (
        event.origin === BASE_URL &&
        event.data.command === THEME_LOAD
    ) {
        const { [MONACO_THEME_KEY]: themeName } = await browser.storage.local.get(MONACO_THEME_KEY)

        if (themeName) {
            sendThemeCommand(themeName)
        }
    }
    if (
        event.origin === BASE_URL &&
        event.data.command === THEME_COMMAND &&
        event.data.themeName
    ) {
        const themeURL = browser.runtime.getURL(`../themes/${event.data.themeName}.json`)
        const themeListURL = browser.runtime.getURL('../themes/themelist.json')
        const theme = await getData(themeURL)
        const themeList = await getData(themeListURL)
        const themeName = event.data.themeName
        const rawThemeName = themeList[themeName]
        const themeBackground = theme.colors['editor.background']

        await storeTheme(themeName, themeBackground)
        sendThemeResponse(theme, rawThemeName)
    }
}


window.addEventListener('message', onMessage)
