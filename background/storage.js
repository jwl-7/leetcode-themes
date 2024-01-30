async function initializeStorage() {
    const DEFAULTS = {
        POPUP_THEME_KEY: 'light',
        LEETCODE_THEME_KEY: 'light',
        LEETCODE_RESET_KEY: false,
        ENABLE_MONACO_THEME_KEY: false,
        MONACO_THEME_KEY: DEFAULT_THEME_NAME,
        MONACO_BACKGROUND_KEY: LIGHT_THEME_EDITOR_BACKGROUND
    }

    try {
        await Promise.all(Object.entries(DEFAULTS).map(([key, value]) => {
            return browser.storage.local.set({ [key]: value })
        }))
    } catch (error) {
        console.error('Error setting default values: ', error)
    }
}
