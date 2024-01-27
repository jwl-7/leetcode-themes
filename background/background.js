function getActiveTab() {
    return browser.tabs.query({ currentWindow: true, active: true })
}

function injectEditorBackgroundColor(themeBackground) {
    const CSS = `
        .monaco-editor,
        .monaco-editor .inputarea.ime-input,
        .monaco-editor .margin,
        .monaco-editor .monaco-editor-background {
            background-color: ${themeBackground} !important;
        }`

    getActiveTab().then(([tab]) => {
        browser.scripting.removeCSS({
            target: { tabId: tab.id },
            css: CSS,
            origin: 'USER'
        })
        browser.scripting.insertCSS({
            target: { tabId: tab.id },
            css: CSS,
            origin: 'USER'
        })
    })
}

function onMessage(request, sender, sendResponse) {
    if (request.command === THEME_RESPONSE && request.theme) {
        const themeBackground = request.theme.colors['editor.background']
        injectEditorBackgroundColor(themeBackground)
    }
}


browser.runtime.onMessage.addListener(onMessage)
