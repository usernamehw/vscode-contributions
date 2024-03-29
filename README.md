[![Version](https://img.shields.io/visual-studio-marketplace/v/usernamehw.contributions)](https://marketplace.visualstudio.com/items?itemName=usernamehw.contributions)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/usernamehw.contributions)](https://marketplace.visualstudio.com/items?itemName=usernamehw.contributions)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/usernamehw.contributions)](https://marketplace.visualstudio.com/items?itemName=usernamehw.contributions)

Generate VSCode extension contribution tables, like below:

<!-- COMMANDS_START -->
## Commands (4)

|Command|Description|
|-|-|
|contributions.generate|Generate contributions -> Insert into README|
|contributions.generateUntitled|Generate contributions -> Open Untitled|
|contributions.generateForInstalled|Generate contributions for installed extension -> Open Untitled|
|contributions.generateForAllInstalled|Generate contributions for ALL installed extensions -> Open Untitled|
<!-- COMMANDS_END -->

<!-- SETTINGS_START -->
## Settings (16)

|Setting|Default|Description|
|-|-|-|
|contributions.sort|"default"|How to sort items in a table.|
|contributions.doOnCompletion|"showNotification"|What to do on finishing editing README file (after running `contributions.generate` command).|
|contributions.addStartEndDelimiters|**true**|Add start and end delimiters to the table.|
|contributions.alignDelimiters|**false**|Make pretty table. (Not pretty if the table is big)|
|contributions.addPadding|**false**|Add whitespaces between delimiters and content.|
|contributions.wrapInDetailsTag|**false**|Warp tables in `<details>` tag to look collapsed by default.|
|contributions.settings.moveOutPrefix|**false**|Move common extension prefix from the first settings table column. (VSMarketplace has bad rendering for wide tables).|
|contributions.settings.includeTypes|**true**|Whether to include setting `type` column or not.|
|contributions.settings.truncateDefaultValue|**0**|Truncate default value if it&#39;s bigger than this setting. (0 to disable).|
|contributions.settings.truncateDescription|**0**|Truncate description if it&#39;s bigger than this setting. (0 to disable).|
|contributions.settings.excludeById|\[\]|Exclude settings from generation (by setting key).|
|contributions.settings.addSpaceAfterCommaInDefaultValue|**false**|Add whitespace symbol after every comma symbol for object/arrays rendered in default value column in Settings table.|
|contributions.settings.replaceDefaultValue|\{\}|Replace setting value.|
|contributions.settings.replaceDescription|\{\}|Replace setting description.|
|contributions.commands.excludeById|\[\]|Exclude commands from generation (by `command` property).|
|contributions.snippets.includeBody|**true**|Whether to include snippet `body` column or not. When enabled - table is rendered with html `<table>` tags.|
<!-- SETTINGS_END -->