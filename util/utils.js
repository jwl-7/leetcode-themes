async function getActiveTab() {
    return await browser.tabs.query({ currentWindow: true, active: true })
}

async function getData(url) {
    const response = await fetch(url)
    return response.json()
}

async function waitForElement(selector, delay=100, limit=20) {
    for (let wait = 1; wait <= limit; wait++) {
        const element = document.querySelector(selector)

        if (element) {
            return element
        }

        await new Promise(resolve => setTimeout(resolve, delay))
    }
    throw new Error(`Can't find '${selector}' element!`)
}

function findParentButton(element) {
    return element && element.tagName === 'BUTTON'
        ? element
        : findParentButton(element?.parentElement)
}
