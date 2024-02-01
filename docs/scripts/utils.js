function hideElement(element) {
    element.classList.add('hidden')
}

function showElement(element) {
    element.classList.remove('hidden')
}

function setBusyStatus(element) {
    element.setAttribute('aria-busy', 'true')
}

function removeBusyStatus(element) {
    element.removeAttribute('aria-busy')
}

function closeErrorAlert() {
    hideElement(errorAlert)
}
