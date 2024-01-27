function getData(url) {
    return fetch(url).then(response => response.json())
}

function sendThemeResponse(theme, themeName) {
    window.postMessage({
        command: THEME_RESPONSE,
        theme: theme,
        themeName: themeName,
    })
    browser.runtime.sendMessage({
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

        sendThemeResponse(theme, themeName)
    }
}


window.addEventListener('message', onMessage)
