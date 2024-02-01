function formatThemeName(themeName) {
    return themeName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

function displayLoading() {
    errorMessage.style.display = 'none'
    loadingMessage.style.display = 'block'
    themeMessage.style.display = 'none'
    themeSelector.disabled = false
}

function displayThemeName(themeName) {
    errorMessage.style.display = 'none'
    loadingMessage.style.display = 'none'
    themeMessage.style.display = 'block'
    selectedTheme.innerHTML = themeName
}
