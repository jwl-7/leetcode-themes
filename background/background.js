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
    if (MONACO_BACKGROUND_KEY in changes) {
        const oldThemeBackground = changes[MONACO_BACKGROUND_KEY].oldValue
        const newThemeBackground = changes[MONACO_BACKGROUND_KEY].newValue

        await injectEditorBackgroundColor(oldThemeBackground, newThemeBackground)
    }
    if (ENABLE_MONACO_THEME_KEY in changes) {
        const [tab] = await getActiveTab()
        const { [MONACO_BACKGROUND_KEY]: themeBackground } = await browser.storage.local.get(MONACO_BACKGROUND_KEY)
        const theme = localStorage.getItem(LEETCODE_THEME_KEY)
        const enableTheme = changes[ENABLE_MONACO_THEME_KEY].newValue

        if (!enableTheme) {
            await browser.scripting.removeCSS({
                target: { tabId: tab.id },
                css: getCSS(themeBackground),
                origin: 'USER'
            })

            if (theme === 'light') {
                await browser.scripting.insertCSS({
                    target: { tabId: tab.id },
                    css: getCSS(LIGHT_THEME_EDITOR_BACKGROUND),
                    origin: 'USER'
                })
                await browser.storage.local.set({[ MONACO_BACKGROUND_KEY]: LIGHT_THEME_EDITOR_BACKGROUND })
            } else {
                await browser.scripting.insertCSS({
                    target: { tabId: tab.id },
                    css: getCSS(DARK_THEME_EDITOR_BACKGROUND),
                    origin: 'USER'
                })
                await browser.storage.local.set({[ MONACO_BACKGROUND_KEY]: DARK_THEME_EDITOR_BACKGROUND })
            }
        }
    }
}

async function onInstalled(details) {
    if (details.reason === 'install' || details.reason === 'update') {
        await initializeStorage()
        console.log('storage', browser.storage.local)
    }
}


browser.runtime.onInstalled.addListener(onInstalled)
browser.storage.local.onChanged.addListener(onLocalStorageChange)
