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

function sendDefaultThemeCommand() {
    window.postMessage({
        command: DEFAULT_THEME_COMMAND
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

function setLeetCodeTheme(theme) {
    const storageEvent = new StorageEvent('storage', {
        key: LEETCODE_THEME_KEY,
        newValue: theme
    })

    localStorage.setItem(LEETCODE_THEME_KEY, theme)
    window.dispatchEvent(storageEvent)
}

async function onLocalStorageChange(changes) {
    if (ENABLE_MONACO_THEME_KEY in changes) {
        const enableTheme = changes[ENABLE_MONACO_THEME_KEY].newValue

        if (!enableTheme) {
            sendDefaultThemeCommand()
        } else {
            const { [MONACO_THEME_KEY]: themeName } = await browser.storage.local.get(MONACO_THEME_KEY)

            if (themeName) {
                sendThemeCommand(themeName)
            }
        }
    }
}

async function onMessage(event) {
    if (
        event.origin === BASE_URL &&
        event.data.command === THEME_LOAD
    ) {
        const { [MONACO_THEME_KEY]: themeName } = await browser.storage.local.get(MONACO_THEME_KEY)
        const { [ENABLE_MONACO_THEME_KEY]: enableTheme } = await browser.storage.local.get(ENABLE_MONACO_THEME_KEY)

        if (enableTheme && themeName) {
            sendThemeCommand(themeName)
        } else {
            sendDefaultThemeCommand()
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
    if (
        event.origin === BASE_URL &&
        event.data.command === LEETCODE_THEME_COMMAND &&
        event.data.theme
    ) {
        const theme = event.data.theme
        setLeetCodeTheme(theme)
    }
}


browser.storage.local.onChanged.addListener(onLocalStorageChange)
window.addEventListener('message', onMessage)
