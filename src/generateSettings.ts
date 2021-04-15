import { markdownTable } from 'markdown-table';
import { extensionConfig } from 'src/extension';
import { IConfigurationProperty, IExtensionContributions } from 'src/types';
import { getMarkdownTableOptions, ln2br, mdln2br, truncateString, wrapInBackticks } from 'src/utils';

export function generateSettings(settingsContrib: IExtensionContributions['configuration']) {
	if (settingsContrib === undefined) {
		return '';
	}

	const settingItems: SettingItem[] = [];

	if (Array.isArray(settingsContrib)) {
		for (const setting of settingsContrib) {
			for (const key in setting.properties) {
				settingItems.push(settingToString(key, setting.properties[key]));
			}
		}
	} else {
		for (const key in settingsContrib.properties) {
			settingItems.push(settingToString(key, settingsContrib.properties[key]));
		}
	}

	if (extensionConfig.sort === 'alphabetical') {
		settingItems.sort((a, b) => a.title.localeCompare(b.title));
	}

	return markdownTable([
		['Setting', 'Type', 'Default', 'Description'],
		...settingItems.map(item => [
			wrapInBackticks(item.title),
			item.type,
			item.default,
			item.description,
		]),
	], getMarkdownTableOptions());
}

export interface SettingItem {
	title: string;
	type: string;
	default: string;
	description: string;
}
export function settingToString(key: string, property: IConfigurationProperty): SettingItem {
	return {
		title: key,
		type: property.type.toString(),
		default: property.default !== undefined ? settingValueToString(property.default) : '',
		description: descriptionToString(property),
	};
}
function settingValueToString(value: unknown) {
	let settingValueStr = '';
	if (typeof value === 'string') {
		settingValueStr = `"${value}"`;
	} else if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
		settingValueStr = `**${value}**`;
	} else if (Array.isArray(value) || typeof value === 'object') {
		settingValueStr = JSON.stringify(value);
	} else {
		settingValueStr = String(value);
	}

	return extensionConfig.settings.truncateDefaultValue === 0 ? settingValueStr : truncateString(settingValueStr, extensionConfig.settings.truncateDefaultValue);
}

function descriptionToString(property: IConfigurationProperty) {
	const descriptionStr = ln2br(mdln2br(property.markdownDescription || '')) || ln2br(property.description) || '';
	return extensionConfig.settings.truncateDescription === 0 ? descriptionStr : truncateString(descriptionStr, extensionConfig.settings.truncateDescription);
}
