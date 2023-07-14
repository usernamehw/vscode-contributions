import { Constants } from './commands';
import { $config } from './extension';
import { mdTable } from './extensionUtils';
import { Color2, generateColors } from './generateColors';
import { Command2, generateCommands } from './generateCommands';
import { Dependency2, generateDependencies } from './generateDependencies';
import { generateSnippetsHtmlTable } from './generateHtmlTable';
import { Setting2, generateSettings } from './generateSettings';
import { Snippet2, generateSnippets } from './generateSnippets';
import { IExtensionContributions, IExtensionManifest } from './types';
import { findCommonPrefix, removePrefix, wrapIn, wrapInDetailsTag } from './utils';

export function contributionsToStrings(contributions: IExtensionContributions, packageJSON: IExtensionManifest, rootPackagePath: string) {
	const commands2: Command2[] = contributions.commands ? generateCommands(contributions.commands) : [];
	const settings2: Setting2[] = contributions.configuration ? generateSettings(contributions.configuration) : [];
	const colors2: Color2[] = contributions.colors ? generateColors(contributions.colors) : [];
	const snippets2: Snippet2[] = contributions.snippets ? generateSnippets(contributions.snippets, rootPackagePath) : [];
	const dependencies2: Dependency2[] = packageJSON.extensionDependencies?.length ? generateDependencies(packageJSON.extensionDependencies) : [];

	if ($config.sort === 'alphabetical') {
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
	if ($config.settings.moveOutPrefix && settings2.length) {
		commonPrefix = findCommonPrefix(settings2.map(setting => setting.id));
	}
	let settingsTable;
	if ($config.settings.includeTypes) {
		settingsTable = mdTable([
			['Setting', 'Type', 'Default', 'Description'],
			...settings2.map(item => [
				$config.settings.moveOutPrefix ? removePrefix(item.id, commonPrefix) : item.id,
				item.type,
				item.default,
				item.description,
			]),
		]);
	} else {
		settingsTable = mdTable([
			['Setting', 'Default', 'Description'],
			...settings2.map(item => [
				$config.settings.moveOutPrefix ? removePrefix(item.id, commonPrefix) : item.id,
				item.default,
				item.description,
			]),
		]);
	}
	let snippetsTable;
	if ($config.snippets.includeBody) {
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

	if ($config.settings.moveOutPrefix) {
		settingsTable = `> **${packageJSON.displayName || packageJSON.name}** extension settings start with \`${commonPrefix}\`\n\n${settingsTable}`;
	}

	if ($config.wrapInDetailsTag) {
		commandsTable = wrapInDetailsTag(commandsTable, Constants.Commands);
		settingsTable = wrapInDetailsTag(settingsTable, Constants.Settings);
		snippetsTable = wrapInDetailsTag(snippetsTable, Constants.Snippets);
		colorsTable = wrapInDetailsTag(colorsTable, Constants.Colors);
		dependenciesTable = wrapInDetailsTag(dependenciesTable, Constants.ExtensionDependencies);
	}

	commandsTable = commands2.length ? `## ${Constants.Commands} (${commands2.length})\n\n${commandsTable}\n\n` : '';
	settingsTable = settings2.length ? `## ${Constants.Settings} (${settings2.length})\n\n${settingsTable}\n\n` : '';
	snippetsTable = snippets2.length ? `## ${Constants.Snippets} (${snippets2.length})\n\n${snippetsTable}\n\n` : '';
	const colorsInstruction = 'Can be specified in `settings.json` (**`workbench.colorCustomizations`** section)';
	colorsTable = colors2.length ? `## ${Constants.Colors} (${colors2.length})\n\n${colorsInstruction}\n\n${colorsTable}\n\n` : '';
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
