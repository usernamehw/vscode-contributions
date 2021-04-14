Generate VSCode extension contribution tables, like below:

## Commands

|Id|Title|
|-|-|
|`contributions.generate`|Generate contributions.|

## Settings

|Setting|Type|Default|Description|
|-|-|-|-|
|contributions.sort|string|"default"|How to sort items in a table.|
|contributions.addStartEndDelimiters|boolean|**true**|Add start and end delimiters to the table.|
|contributions.alignDelimiters|boolean|**false**|Make pretty table. (Not pretty if the table is big)|
|contributions.addPadding|boolean|**false**|Add whitespaces between delimiters and content.|
|contributions.settings.truncateDefaultValue|integer|**0**|Truncate default value if it's bigger than this setting. (0 to disable).|
|contributions.settings.truncateDescription|integer|**0**|Truncate description if it's bigger than this setting. (0 to disable).|