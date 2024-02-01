const DEFAULT_FILE_NAME = 'Unknown Converted Theme.json'


function validateJSON(jsonData) {
    const requiredKeys = ['name', 'type', 'colors', 'tokenColors']
    const missingKeys = requiredKeys.filter(key => !(key in jsonData))

    if (missingKeys.length) {
        console.error(`Missing required keys: ${missingKeys.join(', ')}`)
        return false
    }

    return true
}

function convertTheme() {
    const input = fileInput.files[0]
    const reader = new FileReader()

    if (!input) {
        onConvertThemeError()
        return
    }

    reader.onload = (event) => {
        setBusyStatus(convertThemeButton)
        const inputJSON = JSON.parse(event.target.result)

        if (!validateJSON(inputJSON)) {
            onConvertThemeError()
            return
        }

        const outputJSON = parseVSCodeTheme(inputJSON)
        const outputString = JSON.stringify(outputJSON, null, 4)
        const blob = new Blob([outputString], { type: 'application/json' })
        const fileName = inputJSON.name ?? DEFAULT_FILE_NAME
        const kebabName = formatThemeNameKebab(fileName)

        downloadLink.download = fileName
        downloadLink.href = URL.createObjectURL(blob)

        createCodeSections(outputString, fileName, kebabName)
        onConvertThemeSuccess()
    }

    reader.readAsText(input)
}

function parseVSCodeTheme(theme) {
    const monacoThemeRule = []
    const monacoThemeJSON = {
        inherit: false,
        base: 'vs-dark',
        colors: theme.colors,
        rules: monacoThemeRule,
        encodedTokensColors: []
    }

    theme.tokenColors.forEach((color) => {
        const scopes = typeof color.scope === 'string'
            ? color.scope.split(',')
            : color.scope

        scopes.forEach((scope) => {
            monacoThemeRule.push({
                ...color.settings,
                token: scope.trim()
            })
        })
    })

    return monacoThemeJSON
}
