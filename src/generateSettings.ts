import { extensionConfig } from './extension';
import { IConfiguration, IConfigurationProperty, IExtensionContributions } from './types';
import { escapeMarkdown, ln2br, mdln2br, truncateString, wrapIn } from './utils';
import escape from 'lodash/escape';

export function generateSettings(settingsContrib: NonNullable<IExtensionContributions['configuration']>) {
	const settingItems: Setting2[] = [];
	if (Array.isArray(settingsContrib)) {
		for (const setting of settingsContrib) {
			settingItems.push(...settingsPropertiesToSetting2(setting.properties));
		}
	} else {
		settingItems.push(...settingsPropertiesToSetting2(settingsContrib.properties));
	}
	return settingItems;
}

function settingsPropertiesToSetting2(properties: IConfiguration['properties']) {
	const settingItems = [];
	for (const key in properties) {
		const settingsItem = properties[key];
		if (extensionConfig.settings.excludeById.includes(key)) {
			continue;
		}
		if (settingsItem.deprecationMessage || settingsItem.markdownDeprecationMessage) {
			continue;
		}
		settingItems.push(settingContribToSetting2(key, settingsItem));
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
		settingValueStr = wrapIn(escapeMarkdown(value), '"');
	} else if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
		settingValueStr = wrapIn(String(value), '**');
	} else if (Array.isArray(value) || typeof value === 'object') {
		settingValueStr = escapeMarkdown(JSON.stringify(value));
	} else {
		settingValueStr = String(value);
	}

	return extensionConfig.settings.truncateDefaultValue === 0 ? settingValueStr : truncateString(settingValueStr, extensionConfig.settings.truncateDefaultValue);
}
/**
 * `\n` will break markdown table.
 */
function contribToDescription(property: IConfigurationProperty) {
	return ln2br(mdln2br(property.markdownDescription || '')) || ln2br(escape(property.description) || '') || '';
}
