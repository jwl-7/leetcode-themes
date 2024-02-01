function onConvertThemeError() {
    removeBusyStatus(convertThemeButton)
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
    removeBusyStatus(convertThemeButton)
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

function loadThemeSwitch() {
    const theme = document.documentElement.getAttribute('data-theme')
    themeSwitch.checked = theme === 'light'
}

function onThemeChange(event) {
    const checkbox = event.target
    const theme = checkbox.checked ? 'light' : 'dark'

    document.documentElement.setAttribute('data-theme', theme)
}

function onDOMContentLoaded() {
    new ClipboardJS('#copy-themelist-code')
    new ClipboardJS('#copy-popup-code')
    new ClipboardJS('#copy-json-code')
    loadThemeSwitch()
}


document.addEventListener('DOMContentLoaded', onDOMContentLoaded)
themeSwitch.addEventListener('change', onThemeChange)
convertThemeButton.addEventListener('click', convertTheme)
copyThemeListCodeButton.addEventListener('click', copyThemeListCode)
copyPopupCodeButton.addEventListener('click', copyPopupCode)
copyJSONCodeButton.addEventListener('click', copyJSONCode)
errorAlert.addEventListener('click', closeErrorAlert)
