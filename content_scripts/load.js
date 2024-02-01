(async function load() {
    const enableTheme = await getEnableMonacoTheme()
    const themeName = await getMonacoThemeName()

    if (enableTheme) {
        await browser.runtime.sendMessage({
            command: MONACO_THEME_COMMAND,
            themeName: themeName
        })
    }
})()