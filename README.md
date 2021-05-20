Generate VSCode extension contribution tables, like below:

<!-- COMMANDS_START -->
## Commands (3)

|Command|Description|
|-|-|
|contributions.generate|Generate contributions -> Insert into README|
|contributions.generateUntitled|Generate contributions -> Open Untitled|
|contributions.generateForInstalled|Generate contributions for installed extension -> Open Untitled|
<!-- COMMANDS_END -->

<!-- SETTINGS_START -->
## Settings (13)

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
|contributions.settings.truncateDefaultValue|**0**|Truncate default value if it's bigger than this setting. (0 to disable).|
|contributions.settings.truncateDescription|**0**|Truncate description if it's bigger than this setting. (0 to disable).|
|contributions.settings.excludeById|[]|Exclude settings from generation (by setting key).|
|contributions.commands.excludeById|[]|Exclude commands from generation (by `command` property).|
|contributions.snippets.includeBody|**true**|Whether to include snippet `body` column or not.|
<!-- SETTINGS_END -->