Generate VSCode extension contribution tables, like below:

## Commands

|Command|Description|
|-|-|
|`contributions.generate`|Generate contributions.|

## Settings

|Setting|Type|Default|Description|
|-|-|-|-|
|`contributions.sort`|string|"default"|How to sort items in a table.|
|`contributions.addStartEndDelimiters`|boolean|**true**|Add start and end delimiters to the table.|
|`contributions.wrapInDetailsTag`|boolean|**false**|Warp tables in <details>Collapsed</details> tag to look collapsed by default.|
|`contributions.alignDelimiters`|boolean|**false**|Make pretty table. (Not pretty if the table is big)|
|`contributions.addPadding`|boolean|**false**|Add whitespaces between delimiters and content.|
|`contributions.settings.truncateDefaultValue`|integer|**0**|Truncate default value if it's bigger than this setting. (0 to disable).|
|`contributions.settings.truncateDescription`|integer|**0**|Truncate description if it's bigger than this setting. (0 to disable).|

<svg width="15" height="15"><rect width="15" height="15" style="fill:#ff0000;"/></svg>
