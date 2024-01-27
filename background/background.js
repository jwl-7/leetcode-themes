let previousThemeBackground = null


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

async function injectEditorBackgroundColor(themeBackground) {
    const [tab] = await getActiveTab()

    if (previousThemeBackground) {
        await browser.scripting.removeCSS({
            target: { tabId: tab.id },
            css: getCSS(previousThemeBackground),
            origin: 'USER'
        })
    }

    await browser.scripting.insertCSS({
        target: { tabId: tab.id },
        css: getCSS(themeBackground),
        origin: 'USER'
    })

    previousThemeBackground = themeBackground
}

async function onMessage(request, sender, sendResponse) {
    if (request.command === THEME_RESPONSE && request.theme) {
        const themeBackground = request.theme.colors['editor.background']
        await injectEditorBackgroundColor(themeBackground)
    }
}


browser.runtime.onMessage.addListener(onMessage)
