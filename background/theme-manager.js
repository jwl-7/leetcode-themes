const commandHandlers = {
    [POPUP_THEME_COMMAND]: onPopupThemeCommand,
    [ENABLE_MONACO_THEME_COMMAND]: onEnableMonacoThemeCommand,
    [MONACO_THEME_COMMAND]: onMonacoThemeCommand,
    [LEETCODE_THEME_COMMAND]: onLeetCodeThemeCommand,
    [LEETCODE_RESET_COMMAND]: onLeetCodeResetCommand
}


async function onMessage(message, sender, sendResponse) {
    const handler = commandHandlers[message.command]
    if (handler) await handler(message)
}


browser.runtime.onMessage.addListener(onMessage)
