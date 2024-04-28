async function executeContentScript() {
    const [tab] = await getActiveTab()

    await browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content_scripts/reset-code-explore.js']
    })
}

async function handleURLChange(details) {
    if (details.url.startsWith(EXPLORE_URL)) await executeContentScript()
}


browser.webNavigation.onHistoryStateUpdated.addListener(handleURLChange)
