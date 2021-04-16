Generate VSCode extension contribution tables, like below:

## Commands (2)

|Command|Description|
|-|-|
|contributions.generate|Generate contributions.|
|contributions.generateForInstalled|Generate contributions for installed extension.|

## Settings (8)

|Setting|Type|Default|Description|
|-|-|-|-|
|contributions.sort|string|"default"|How to sort items in a table.|
|contributions.addStartEndDelimiters|boolean|**true**|Add start and end delimiters to the table.|
|contributions.wrapInDetailsTag|boolean|**false**|Warp tables in `<details>` tag to look collapsed by default.|
|contributions.alignDelimiters|boolean|**false**|Make pretty table. (Not pretty if the table is big)|
|contributions.addPadding|boolean|**false**|Add whitespaces between delimiters and content.|
|contributions.settings.moveOutPrefix|boolean|**false**|Move common extension prefix from the first settings table column. (VSMarketplace has bad rendering for wide tables).|
|contributions.settings.truncateDefaultValue|integer|**0**|Truncate default value if it's bigger than this setting. (0 to disable).|
|contributions.settings.truncateDescription|integer|**0**|Truncate description if it's bigger than this setting. (0 to disable).|

