import { extensionConfig } from 'src/extension';
import { IConfigurationProperty, IExtensionContributions } from 'src/types';
import { ln2br, mdln2br, truncateString, wrapIn } from 'src/utils';

export function generateSettings(settingsContrib: NonNullable<IExtensionContributions['configuration']>) {
	const settingItems: Setting2[] = [];

	if (Array.isArray(settingsContrib)) {
		for (const setting of settingsContrib) {
			for (const key in setting.properties) {
				settingItems.push(settingContribToSetting2(key, setting.properties[key]));
			}
		}
	} else {
		for (const key in settingsContrib.properties) {
			settingItems.push(settingContribToSetting2(key, settingsContrib.properties[key]));
		}
	}

	return settingItems;
}

export interface Setting2 {
	id: string;
	type: string;
	default: string;
	description: string;
}
export function settingContribToSetting2(key: string, property: IConfigurationProperty): Setting2 {
	let id = key;
	let description = contribToDescription(property);

	if (description.toLocaleLowerCase().includes('paid')) {
		id = `💲 ${id}`;
	}

	if (extensionConfig.settings.truncateDescription !== 0) {
		description = truncateString(description, extensionConfig.settings.truncateDescription);
	}

	return {
		id,
		type: property.type?.toString() || '',
		default: property.default !== undefined ? settingValueToString(property.default) : '',
		description,
	};
}
function settingValueToString(value: unknown) {
	let settingValueStr = '';
	if (typeof value === 'string') {
		settingValueStr = wrapIn(value, '"');
	} else if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
		settingValueStr = wrapIn(String(value), '**');
	} else if (Array.isArray(value) || typeof value === 'object') {
		settingValueStr = JSON.stringify(value);
	} else {
		settingValueStr = String(value);
	}

	return extensionConfig.settings.truncateDefaultValue === 0 ? settingValueStr : truncateString(settingValueStr, extensionConfig.settings.truncateDefaultValue);
}
/**
 * `\n` will break markdown table.
 */
function contribToDescription(property: IConfigurationProperty) {
	return ln2br(mdln2br(property.markdownDescription || '')) || ln2br(property.description || '') || '';
}
