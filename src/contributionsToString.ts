import { Constants } from 'src/commands';
import { extensionConfig } from 'src/extension';
import { mdTable } from 'src/extensionUtils';
import { Color2, generateColors } from 'src/generateColors';
import { Command2, generateCommands } from 'src/generateCommands';
import { Dependency2, generateDependencies } from 'src/generateDependencies';
import { generateSnippetsHtmlTable } from 'src/generateHtmlTable';
import { generateSettings, Setting2 } from 'src/generateSettings';
import { generateSnippets, Snippet2 } from 'src/generateSnippets';
import { IExtensionContributions, IExtensionManifest } from 'src/types';
import { findCommonPrefix, removePrefix, wrapIn, wrapInDetailsTag } from 'src/utils';

export function contributionsToStrings(contributions: IExtensionContributions, packageJSON: IExtensionManifest, rootPackagePath: string) {
	const commands2: Command2[] = contributions.commands ? generateCommands(contributions.commands) : [];
	const settings2: Setting2[] = contributions.configuration ? generateSettings(contributions.configuration) : [];
	const colors2: Color2[] = contributions.colors ? generateColors(contributions.colors) : [];
	const snippets2: Snippet2[] = contributions.snippets ? generateSnippets(contributions.snippets, rootPackagePath) : [];
	const dependencies2: Dependency2[] = packageJSON.extensionDependencies?.length ? generateDependencies(packageJSON.extensionDependencies) : [];

	if (extensionConfig.sort === 'alphabetical') {
		commands2.sort((a, b) => a.id.localeCompare(b.id));
		settings2.sort((a, b) => a.id.localeCompare(b.id));
		colors2.sort((a, b) => a.id.localeCompare(b.id));
		snippets2.sort((a, b) => a.prefix.localeCompare(b.prefix));
		dependencies2.sort((a, b) => a.name.localeCompare(b.name));
	}

	let commandsTable = mdTable([
		['Command', 'Description'],
		...commands2.map(command => [
			command.id,
			command.title,
		])]);
	let commonPrefix = '';
	if (extensionConfig.settings.moveOutPrefix && settings2.length) {
		commonPrefix = findCommonPrefix(settings2.map(setting => setting.id));
	}
	let settingsTable;
	if (extensionConfig.settings.includeTypes) {
		settingsTable = mdTable([
			['Setting', 'Type', 'Default', 'Description'],
			...settings2.map(item => [
				extensionConfig.settings.moveOutPrefix ? removePrefix(item.id, commonPrefix) : item.id,
				item.type,
				item.default,
				item.description,
			]),
		]);
	} else {
		settingsTable = mdTable([
			['Setting', 'Default', 'Description'],
			...settings2.map(item => [
				extensionConfig.settings.moveOutPrefix ? removePrefix(item.id, commonPrefix) : item.id,
				item.default,
				item.description,
			]),
		]);
	}
	let snippetsTable;
	if (extensionConfig.snippets.includeBody) {
		snippetsTable = generateSnippetsHtmlTable(snippets2);
	} else {
		snippetsTable = mdTable([
			['Prefix', 'Description'],
			...snippets2.map(snippet => [
				snippet.prefix,
				snippet.description,
			]),
		]);
	}
	let colorsTable = mdTable([
		['Color', 'Dark', 'Light', 'HC', 'Description'],
		...colors2.map(color => [
			color.id,
			wrapIn(color.dark, '`'),
			wrapIn(color.light, '`'),
			wrapIn(color.hc, '`'),
			color.description,
		]),
	]);
	let dependenciesTable = mdTable([
		['Extension Name', 'Description'],
		...dependencies2.map(dep => [
			dep.name,
			dep.description,
		]),
	]);

	if (extensionConfig.settings.moveOutPrefix) {
		settingsTable = `> **${packageJSON.displayName || packageJSON.name}** extension settings start with \`${commonPrefix}\`\n\n${settingsTable}`;
	}

	if (extensionConfig.wrapInDetailsTag) {
		commandsTable = wrapInDetailsTag(commandsTable, Constants.Commands);
		settingsTable = wrapInDetailsTag(settingsTable, Constants.Settings);
		snippetsTable = wrapInDetailsTag(snippetsTable, Constants.Snippets);
		colorsTable = wrapInDetailsTag(colorsTable, Constants.Colors);
		dependenciesTable = wrapInDetailsTag(dependenciesTable, Constants.ExtensionDependencies);
	}

	commandsTable = commands2.length ? `## ${Constants.Commands} (${commands2.length})\n\n${commandsTable}\n\n` : '';
	settingsTable = settings2.length ? `## ${Constants.Settings} (${settings2.length})\n\n${settingsTable}\n\n` : '';
	snippetsTable = snippets2.length ? `## ${Constants.Snippets} (${snippets2.length})\n\n${snippetsTable}\n\n` : '';
	colorsTable = colors2.length ? `## ${Constants.Colors} (${colors2.length})\n\n${colorsTable}\n\n` : '';
	dependenciesTable = dependencies2.length ? `## ${Constants.ExtensionDependencies} (${dependencies2.length})\n\n${dependenciesTable}\n\n` : '';
	return {
		commands2,
		settings2,
		snippets2,
		colors2,
		dependencies2,
		commandsTable,
		settingsTable,
		snippetsTable,
		colorsTable,
		dependenciesTable,
	};
}
