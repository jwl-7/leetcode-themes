(async function resetCodeExplore() {
    const resetEnable = await getLeetCodeReset()
    if (!resetEnable) return

    const resetButtonSelector = '.editor-btn.reset-btn'
    const resetConfirmModalSelector = '.rc-dialog.base-modal__2SlO'
    const resetButton = await waitForElement(resetButtonSelector)

    if (resetButton) {
        resetButton.click()
        const resetConfirmModal = await waitForElement(resetConfirmModalSelector)

        if (resetConfirmModal) {
            const buttons = resetConfirmModal.querySelectorAll('button')
            const confirmButton = Array.from(buttons)
                .find(({ textContent }) => textContent.trim() === 'Reset')

            if (confirmButton) confirmButton.click()
        }
    }
})()
