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
## Settings (8)

> **Contributions** extension settings start with `contributions.`

|Setting|Type|Default|Description|
|-|-|-|-|
|sort|string|"default"|How to sort items in a table.|
|addStartEndDelimiters|boolean|**true**|Add start and end delimiters to the table.|
|alignDelimiters|boolean|**false**|Make pretty table. (Not pretty if the table is big)|
|addPadding|boolean|**false**|Add whitespaces between delimiters and content.|
|wrapInDetailsTag|boolean|**false**|Warp tables in `<details>` tag to look collapsed by default.|
|settings.moveOutPrefix|boolean|**false**|Move common extension prefix from the first settings table column. (VSMarketplace has bad rendering for wide tables).|
|settings.truncateDefaultValue|integer|**0**|Truncate default value if it's bigger than this setting. (0 to disable).|
|settings.truncateDescription|integer|**0**|Truncate description if it's bigger than this setting. (0 to disable).|
<!-- SETTINGS_END -->
