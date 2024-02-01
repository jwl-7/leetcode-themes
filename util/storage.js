async function initializeStorage() {
    const DEFAULTS = {
        POPUP_THEME_KEY: 'light',
        LEETCODE_THEME_KEY: 'light',
        LEETCODE_RESET_KEY: false,
        ENABLE_MONACO_THEME_KEY: false,
        MONACO_THEME_KEY: 'Nord',
        MONACO_BACKGROUND_KEY: '#2E3440'
    }

    try {
        await Promise.all(Object.entries(DEFAULTS).map(([key, value]) => {
            return browser.storage.local.set({ [key]: value })
        }))
    } catch (error) {
        console.error('Error setting default values: ', error)
    }
}

async function storePopupTheme(theme) {
    await browser.storage.local.set({ [POPUP_THEME_KEY]: theme })
}

async function storeEnableMonacoTheme(enable) {
    await browser.storage.local.set({ [ENABLE_MONACO_THEME_KEY]: enable })
}

async function storeMonacoTheme(themeName, themeBackground) {
    await browser.storage.local.set({
        [MONACO_THEME_KEY]: themeName,
        [MONACO_BACKGROUND_KEY]: themeBackground
    })
}

async function storeLeetCodeTheme(theme) {
    await browser.storage.local.set({ [LEETCODE_THEME_KEY]: theme })
}

async function storeLeetCodeReset(enable) {
    await browser.storage.local.set({ [LEETCODE_RESET_KEY]: enable })
}

async function getPopupTheme() {
    return (await browser.storage.local.get(POPUP_THEME_KEY))[POPUP_THEME_KEY]
}

async function getEnableMonacoTheme() {
    return (await browser.storage.local.get(ENABLE_MONACO_THEME_KEY))[ENABLE_MONACO_THEME_KEY]
}

async function getMonacoTheme(themeName) {
    const themeURL = browser.runtime.getURL(`themes/${themeName}.json`)
    const theme = await getData(themeURL)

    return theme
}

async function getMonacoThemeBackground() {
    return (await browser.storage.local.get(MONACO_BACKGROUND_KEY))[MONACO_BACKGROUND_KEY]
}

async function getMonacoThemeName() {
    return (await browser.storage.local.get(MONACO_THEME_KEY))[MONACO_THEME_KEY]
}

async function getRawThemeName(themeName) {
    const themeListURL = browser.runtime.getURL('themes/themelist.json')
    const themeList = await getData(themeListURL)
    const rawThemeName = themeList[themeName]

    return rawThemeName
}

async function getLeetCodeTheme() {
    return (await browser.storage.local.get(LEETCODE_THEME_KEY))[LEETCODE_THEME_KEY]
}

async function getLeetCodeReset() {
    return (await browser.storage.local.get(LEETCODE_RESET_KEY))[LEETCODE_RESET_KEY]
}
