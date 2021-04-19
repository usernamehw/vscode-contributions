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
## Settings (12)

|Setting|Type|Default|Description|
|-|-|-|-|
|contributions.sort|string|"default"|How to sort items in a table.|
|contributions.doOnCompletion|string|"showNotification"|What to do on finishing editing README file (after running `contributions.generate` command).|
|contributions.addStartEndDelimiters|boolean|**true**|Add start and end delimiters to the table.|
|contributions.alignDelimiters|boolean|**false**|Make pretty table. (Not pretty if the table is big)|
|contributions.addPadding|boolean|**false**|Add whitespaces between delimiters and content.|
|contributions.wrapInDetailsTag|boolean|**false**|Warp tables in `<details>` tag to look collapsed by default.|
|contributions.settings.moveOutPrefix|boolean|**false**|Move common extension prefix from the first settings table column. (VSMarketplace has bad rendering for wide tables).|
|contributions.settings.includeTypes|boolean|**true**|Whether to include setting `type` column or not.|
|contributions.settings.truncateDefaultValue|integer|**0**|Truncate default value if it's bigger than this setting. (0 to disable).|
|contributions.settings.truncateDescription|integer|**0**|Truncate description if it's bigger than this setting. (0 to disable).|
|contributions.settings.excludeById|array|[]|Exclude settings from generation (by setting key).|
|contributions.commands.excludeById|array|[]|Exclude commands from generation (by `command` property).|
<!-- SETTINGS_END -->