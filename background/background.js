async function onInstalled(details) {
    if (details.reason === 'install' || details.reason === 'update') {
        await initializeStorage()
    }
}


browser.runtime.onInstalled.addListener(onInstalled)
