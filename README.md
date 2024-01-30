# leetcode-themes
a firefox browser extension for customizing LeetCode editor
[![leetcode-themes.png](https://i.imgur.com/WW3otB0.png)](https://imgur.com/WW3otB0)

## TODO
- Refactor theme converter using Pico b/c bootstrap is too booty
- Explore solutions for converting CSS tags -> Monaco JSON theme
- Fix issues with scripts on initial load
- Fix inconsistent bug when switching backgrounds that causes a weird outline
- Look into possible inconsistencies when injecting css background
- Fix bug with switching to default themes
- Add initialization file for setting up storage defaults
- Refactor like like just one file at first, but then all of them before scope creepin

## Features
- Enable Popup Dark Mode - Toggle Popup light/dark theme
- Enable LeetCode Dark Mode - Toggle LeetCode light/dark theme
- Enable LeetCode Editor Theme - Toggle LeetCode Editor theme on/off
- Enable Auto Reset Code - Toggle auto reset code on initial load
- Internal tool for converting VS Code theme -> Monaco theme

## Support
- This browser extension is exclusively for Mozilla Firefox and the LeetCode 2023 Dynamic Layout

## Dev Setup
- Install web-ext: `npm install --global web-ext`
- Run web-ext: `web-ext run --firefox-preview`

## License
This project is released under the GNU GPL License - see the [LICENSE](LICENSE) file for details
