const LOADING_TIMEOUT = 1000
const DEFAULT_FILE_NAME = 'Unknown Converted Theme.json'

const convertThemeButton = document.getElementById('convert-theme')
const fileInput = document.getElementById('theme-file-input')
const downloadLink = document.getElementById('download')
const loadingSpinner = document.getElementById('loading-spinner')
const loader = document.getElementById('loader')
const errorAlert = document.getElementById('error-alert')
const codeThemeList = document.getElementById('code-themelist')
const codePopup = document.getElementById('code-popup')
const codeJSON = document.getElementById('code-json')
const copyThemeListInfo = document.getElementById('copy-themelist-info')
const copyPopupInfo = document.getElementById('copy-popup-info')
const copyJSONInfo = document.getElementById('copy-json-info')
const copyThemeListCodeButton = document.getElementById('copy-themelist-code')
const copyPopupCodeButton = document.getElementById('copy-popup-code')
const copyJSONCodeButton = document.getElementById('copy-json-code')
const closeErrorAlertButton = document.getElementById('close-error-alert')


function validateJSON(jsonData) {
    const requiredKeys = ['name', 'type', 'colors', 'tokenColors']
    const missingKeys = requiredKeys.filter(key => !(key in jsonData))

    if (missingKeys.length) {
        console.error(`Missing required keys: ${missingKeys.join(', ')}`)
        return false
    }

    return true
}

function hideElement(element) {
    element.classList.add('d-none')
}

function showElement(element) {
    element.classList.remove('d-none')
}

function convertTheme() {
    const input = fileInput.files[0]
    const reader = new FileReader()

    if (!input) {
        onConvertThemeError()
        return
    }

    reader.onload = (event) => {
        showElement(loadingSpinner)
        showElement(loader)

        const inputJSON = JSON.parse(event.target.result)

        if (!validateJSON(inputJSON)) {
            onConvertThemeError()
            return
        }

        const outputJSON = parseVSCodeTheme(inputJSON)
        const outputString = JSON.stringify(outputJSON, null, 4)
        const blob = new Blob([outputString], { type: 'application/json' })
        const fileName = inputJSON.name ?? DEFAULT_FILE_NAME
        const kebabName = formatThemeNameKebab(fileName)

        setTimeout(() => {
            downloadLink.download = fileName
            downloadLink.href = URL.createObjectURL(blob)
        }, LOADING_TIMEOUT)

        createCodeSections(outputString, fileName, kebabName)
        onConvertThemeSuccess()
    }

    reader.readAsText(input)
}

function parseVSCodeTheme(theme) {
    const monacoThemeRule = []
    const monacoThemeJSON = {
        inherit: false,
        base: 'vs-dark',
        colors: theme.colors,
        rules: monacoThemeRule,
        encodedTokensColors: []
    }

    theme.tokenColors.forEach((color) => {
        const scopes = typeof color.scope === 'string'
            ? color.scope.split(',')
            : color.scope

        scopes.forEach((scope) => {
            monacoThemeRule.push({
                ...color.settings,
                token: scope.trim()
            })
        })
    })

    return monacoThemeJSON
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

function formatThemeNameKebab(themeName) {
    return themeName.replace(/\s+/g, '-').toLowerCase()
}

function onConvertThemeError() {
    hideElement(loadingSpinner)
    hideElement(loader)
    hideElement(downloadLink)
    hideElement(codeThemeList)
    hideElement(codePopup)
    hideElement(codeJSON)
    hideElement(copyThemeListInfo)
    hideElement(copyPopupInfo)
    hideElement(copyJSONInfo)
    hideElement(copyThemeListCodeButton)
    hideElement(copyPopupCodeButton)
    hideElement(copyJSONCodeButton)
    showElement(errorAlert)
}

function onConvertThemeSuccess() {
    hideElement(loadingSpinner)
    hideElement(loader)
    hideElement(errorAlert)
    showElement(downloadLink)
    showElement(copyThemeListInfo)
    showElement(copyPopupInfo)
    showElement(copyJSONInfo)
    showElement(codeThemeList)
    showElement(codePopup)
    showElement(codeJSON)
    showElement(copyThemeListCodeButton)
    showElement(copyPopupCodeButton)
    showElement(copyJSONCodeButton)
}

function closeErrorAlert() {
    hideElement(errorAlert)
}

function copyThemeListCode() {
    copyThemeListCodeButton.textContent = 'JSON Copied'

    setTimeout(() => {
        copyThemeListCodeButton.textContent = 'Copy JSON'
    }, 2000)
}

function copyPopupCode() {
    copyPopupCodeButton.textContent = 'HTML Copied'

    setTimeout(() => {
        copyPopupCodeButton.textContent = 'Copy HTML'
    }, 2000)
}

function copyJSONCode() {
    copyJSONCodeButton.textContent = 'JSON Copied'

    setTimeout(() => {
        copyJSONCodeButton.textContent = 'Copy JSON'
    }, 2000)
}

function onDOMContentLoaded() {
    new ClipboardJS('#copy-themelist-code')
    new ClipboardJS('#copy-popup-code')
    new ClipboardJS('#copy-json-code')
}


document.addEventListener('DOMContentLoaded', onDOMContentLoaded)
convertThemeButton.addEventListener('click', convertTheme)
copyThemeListCodeButton.addEventListener('click', copyThemeListCode)
copyPopupCodeButton.addEventListener('click', copyPopupCode)
copyJSONCodeButton.addEventListener('click', copyJSONCode)
closeErrorAlertButton.addEventListener('click', closeErrorAlert)
