const COPIED_TEXT = 'Copied \u2713'


function formatThemeNameKebab(themeName) {
    return themeName.replace(/\s+/g, '-').toLowerCase()
}

function createCodeSections(outputString, fileName, kebabName) {
    const codeElementThemeList = document.createElement('code')
    const codeElementPopup = document.createElement('code')
    const codeElementJSON = document.createElement('code')

    if (codeThemeList.firstChild) {
        codeThemeList.removeChild(codeThemeList.firstChild)
    }

    if (codePopup.firstChild) {
        codePopup.removeChild(codePopup.firstChild)
    }

    if (codeJSON.firstChild) {
        codeJSON.removeChild(codeJSON.firstChild)
    }

    codeElementThemeList.textContent = `"${fileName}": "${kebabName}",`
    codeThemeList.appendChild(codeElementThemeList)
    hljs.highlightElement(codeElementThemeList)

    codeElementPopup.textContent = `<option value="${kebabName}">${fileName}</option>`
    codePopup.appendChild(codeElementPopup)
    hljs.highlightElement(codeElementPopup)

    codeElementJSON.textContent = outputString
    codeJSON.appendChild(codeElementJSON)
    hljs.highlightElement(codeElementJSON)
}

function copyThemeListCode() {
    copyThemeListCodeButton.textContent = COPIED_TEXT

    setTimeout(() => {
        copyThemeListCodeButton.textContent = 'Copy JSON'
    }, 2000)
}

function copyPopupCode() {
    copyPopupCodeButton.textContent = COPIED_TEXT

    setTimeout(() => {
        copyPopupCodeButton.textContent = 'Copy HTML'
    }, 2000)
}

function copyJSONCode() {
    copyJSONCodeButton.textContent = COPIED_TEXT

    setTimeout(() => {
        copyJSONCodeButton.textContent = 'Copy JSON'
    }, 2000)
}
