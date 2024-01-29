async function getActiveTab() {
    return await browser.tabs.query({ currentWindow: true, active: true })
}

function getCSS(themeBackground) {
    return `
        .monaco-editor,
        .monaco-editor .inputarea.ime-input,
        .monaco-editor .margin,
        .monaco-editor .monaco-editor-background {
            background-color: ${themeBackground} !important;
        }`
}

async function injectEditorBackgroundColor(oldThemeBackground, newThemeBackground) {
    const [tab] = await getActiveTab()

    if (oldThemeBackground) {
        await browser.scripting.removeCSS({
            target: { tabId: tab.id },
            css: getCSS(oldThemeBackground),
            origin: 'USER'
        })
    }

    await browser.scripting.insertCSS({
        target: { tabId: tab.id },
        css: getCSS(newThemeBackground),
        origin: 'USER'
    })
}

async function onLocalStorageChange(changes) {
    if (THEME_BACKGROUND_KEY in changes) {
        const oldThemeBackground = changes[THEME_BACKGROUND_KEY].oldValue
        const newThemeBackground = changes[THEME_BACKGROUND_KEY].newValue

        await injectEditorBackgroundColor(oldThemeBackground, newThemeBackground)
    }
}


browser.storage.local.onChanged.addListener(onLocalStorageChange)
