async function getData(url) {
    const response = await fetch(url)
    return response.json()
}

async function sendThemeResponse(theme, themeName) {
    window.postMessage({
        command: THEME_RESPONSE,
        theme: theme,
        themeName: themeName,
    })
    await browser.runtime.sendMessage({
        command: THEME_RESPONSE,
        theme: theme
    })
}

async function onMessage(event) {
    if (
        event.origin === BASE_URL &&
        event.data.command === THEME_COMMAND &&
        event.data.themeName
    ) {
        const themeURL = browser.runtime.getURL(`../themes/${event.data.themeName}.json`)
        const themeListURL = browser.runtime.getURL('../themes/themelist.json')
        const theme = await getData(themeURL)
        const themeList = await getData(themeListURL)
        const themeName = themeList[event.data.themeName]

        await sendThemeResponse(theme, themeName)
    }
}


window.addEventListener('message', onMessage)
