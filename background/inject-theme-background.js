function getCSS(themeBackground) {
    return `
        .monaco-editor,
        .monaco-editor .inputarea.ime-input,
        .monaco-editor .margin,
        .monaco-editor .monaco-editor-background {
            background-color: ${themeBackground} !important;
        }`
}

async function removeThemeBackground(themeBackground) {
    const [tab] = await getActiveTab()
    await browser.scripting.removeCSS({
        target: { tabId: tab.id },
        css: getCSS(themeBackground),
        origin: 'USER'
    })
}

async function insertThemeBackground(themeBackground) {
    const [tab] = await getActiveTab()
    await browser.scripting.insertCSS({
        target: { tabId: tab.id },
        css: getCSS(themeBackground),
        origin: 'USER'
    })
}

async function injectEditorBackgroundColor(oldThemeBackground, newThemeBackground) {
    await removeThemeBackground(oldThemeBackground)
    await insertThemeBackground(newThemeBackground)
}

async function onLocalStorageChange(changes) {
    if (MONACO_BACKGROUND_KEY in changes) {
        const enableTheme = await getEnableMonacoTheme()
        const oldThemeBackground = changes[MONACO_BACKGROUND_KEY].oldValue
        const newThemeBackground = changes[MONACO_BACKGROUND_KEY].newValue

        if (enableTheme) {
            await injectEditorBackgroundColor(oldThemeBackground, newThemeBackground)
        }
    }
    if (ENABLE_MONACO_THEME_KEY in changes) {
        const themeBackground = await getMonacoThemeBackground()
        const enableTheme = changes[ENABLE_MONACO_THEME_KEY].newValue

        if (enableTheme) {
            await insertThemeBackground(themeBackground)
        } else {
            await removeThemeBackground(themeBackground)
        }
    }
}


browser.storage.local.onChanged.addListener(onLocalStorageChange)
