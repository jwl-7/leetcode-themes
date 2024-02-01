(async function resetCode() {
    const resetEnable = await getLeetCodeReset()
    if (!resetEnable) return

    const resetButtonSelector = '[data-icon="arrow-rotate-left"]'
    const resetConfirmModalSelector = '.z-modal[role="dialog"]'
    const resetButtonSVG = await waitForElement(resetButtonSelector)

    if (resetButtonSVG) {
        const resetButton = findParentButton(resetButtonSVG)

        if (resetButton) {
            resetButton.click()
            const resetConfirmModal = await waitForElement(resetConfirmModalSelector)

            if (resetConfirmModal) {
                const buttons = resetConfirmModal.querySelectorAll('button')
                const confirmButton = Array.from(buttons)
                    .find(({ textContent }) => textContent.trim() === 'Confirm')

                if (confirmButton) confirmButton.click()
            }
        }
    }
})()
