import fs from 'fs';
import { extensionConfig } from 'src/extension';
import { mdTable } from 'src/extensionUtils';
import { Color2, generateColors } from 'src/generateColors';
import { Command2, generateCommands } from 'src/generateCommands';
import { generateSettings, Setting2 } from 'src/generateSettings';
import { IExtensionContributions, IExtensionManifest } from 'src/types';
import { findCommonPrefix, removeLastChar, removePrefix, wrapInBackticks, wrapInDetailsTag } from 'src/utils';
import { openInUntitled } from 'src/vscodeUtils';
import { commands, Disposable, extensions, QuickPickItem, Uri, window, workspace } from 'vscode';

const enum Constants {
	'Settings' = 'Settings',
	'Commands' = 'Commands',
	'Colors' = 'Colors',
	commandsStart = '<!-- COMMANDS_START -->',
	commandsEnd = '<!-- COMMANDS_END -->',
	settingsStart = '<!-- SETTINGS_START -->',
	settingsEnd = '<!-- SETTINGS_END -->',
	colorsStart = '<!-- COLORS_START -->',
	colorsEnd = '<!-- COLORS_END -->',
	regexpAnything = '[\\s\\S]*?',
}

export function registerAllCommands(subscriptions: Disposable[]) {
	subscriptions.push(commands.registerCommand('contributions.generate', async () => {
		const packageJsonFiles = await workspace.findFiles('package.json');

		if (packageJsonFiles.length === 0) {
			window.showWarningMessage('Cannot find `package.json`');
			return;
		}

		let targetPackageJsonPath;
		if (packageJsonFiles.length > 1) {
			const pickedFile = await window.showQuickPick(packageJsonFiles.map(file => file.fsPath));
			if (!pickedFile) {
				return;
			}
			targetPackageJsonPath = pickedFile;
		} else {
			targetPackageJsonPath = packageJsonFiles[0].fsPath;
		}

		let targetJson;
		try {
			targetJson = await workspace.fs.readFile(Uri.file(targetPackageJsonPath));
		} catch (e: unknown) {
			window.showErrorMessage(String(e));
			return;
		}
		let parsedJson: IExtensionManifest;
		try {
			parsedJson = JSON.parse(targetJson.toString());
		} catch (e: unknown) {
			window.showErrorMessage(`Invalid JSON. Parsing of "${targetPackageJsonPath}" failed.`);
			window.showErrorMessage(String(e));
			return;
		}

		const { contributes } = parsedJson;
		if (!contributes) {
			window.showInformationMessage('No contributions');
			return;
		}
		generateContributions(contributes, parsedJson, false);
	}));
	// ──────────────────────────────────────────────────────────────────────
	subscriptions.push(commands.registerCommand('contributions.generateForInstalled', async () => {
		const itemsForQuickPick: QuickPickItem[] = extensions.all.map(ext => ({
			label: (ext.packageJSON as IExtensionManifest).displayName || (ext.packageJSON as IExtensionManifest).name,
			detail: ext.id,
		}));

		const picked = await window.showQuickPick(itemsForQuickPick);
		if (!picked) {
			return;
		}

		const pickedExtension = extensions.getExtension(picked.detail!);
		const contributions = (pickedExtension?.packageJSON as IExtensionManifest).contributes;

		if (contributions) {
			generateContributions(contributions, pickedExtension?.packageJSON, true);
		}
	}));
}

async function generateContributions(contributions: IExtensionContributions, packageJSON: IExtensionManifest, forInstalledExtension: boolean) {
	const commands2: Command2[] = contributions.commands ? generateCommands(contributions.commands) : [];
	const settings2: Setting2[] = contributions.configuration ? generateSettings(contributions.configuration) : [];
	const colors2: Color2[] = contributions.colors ? generateColors(contributions.colors) : [];

	if (extensionConfig.sort === 'alphabetical') {
		commands2.sort((a, b) => a.id.localeCompare(b.id));
		settings2.sort((a, b) => a.id.localeCompare(b.id));
		colors2.sort((a, b) => a.id.localeCompare(b.id));
	}

	let commandsTable = mdTable([
		['Command', 'Description'],
		...commands2.map(command => [
			command.id,
			command.title,
		])]);
	let commonPrefix = '';
	if (extensionConfig.settings.moveOutPrefix) {
		commonPrefix = findCommonPrefix(settings2.map(setting => setting.id));
	}
	let settingsTable = mdTable([
		['Setting', 'Type', 'Default', 'Description'],
		...settings2.map(item => [
			extensionConfig.settings.moveOutPrefix ? removePrefix(item.id, commonPrefix) : item.id,
			item.type,
			item.default,
			item.description,
		]),
	]);
	let colorsTable = mdTable([
		['Color', 'Dark', 'Light', 'HC', 'Description'],
		...colors2.map(color => [
			color.id,
			wrapInBackticks(color.dark),
			wrapInBackticks(color.light),
			wrapInBackticks(color.hc),
			color.description,
		]),
	]);

	if (extensionConfig.settings.moveOutPrefix) {
		settingsTable = `> **${packageJSON.displayName || packageJSON.name}** extension settings start with \`${commonPrefix}\`\n\n${settingsTable}`;
	}

	if (extensionConfig.wrapInDetailsTag) {
		commandsTable = wrapInDetailsTag(commandsTable, Constants.Commands);
		settingsTable = wrapInDetailsTag(settingsTable, Constants.Settings);
		colorsTable = wrapInDetailsTag(colorsTable, Constants.Colors);
	}

	commandsTable = commands2.length ? `## ${Constants.Commands} (${commands2.length})\n\n${commandsTable}\n\n` : '';
	settingsTable = settings2.length ? `## ${Constants.Settings} (${settings2.length})\n\n${settingsTable}\n\n` : '';
	colorsTable = colors2.length ? `## ${Constants.Colors} (${colors2.length})\n\n${colorsTable}\n\n` : '';

	if (!forInstalledExtension && extensionConfig.autoInsertIntoREADME) {
		const reamdeFiles = await workspace.findFiles('README.md');
		if (!reamdeFiles.length) {
			window.showErrorMessage('Coundn\'t find any README files');
			return;
		}
		let readmePath = reamdeFiles[0].fsPath;
		if (reamdeFiles.length > 1) {
			const itemsForQuickPick: QuickPickItem[] = reamdeFiles.map(uri => ({
				label: uri.fsPath,
			}));

			const picked = await window.showQuickPick(itemsForQuickPick);
			if (!picked) {
				return;
			}
			readmePath = picked.label;
		}
		const readmeUri = Uri.file(readmePath);
		let readmeContent = (await workspace.fs.readFile(readmeUri)).toString();

		const newCommandsContent = commands2.length ? `${Constants.commandsStart}\n${removeLastChar(commandsTable)}${Constants.commandsEnd}` : '';
		const newSettingsContent = settings2.length ? `${Constants.settingsStart}\n${removeLastChar(settingsTable)}${Constants.settingsEnd}` : '';
		const newColorsContent = colors2.length ? `${Constants.colorsStart}\n${removeLastChar(colorsTable)}${Constants.colorsEnd}` : '';

		const commandsRegexp = new RegExp(`${Constants.commandsStart}${Constants.regexpAnything}${Constants.commandsEnd}`);
		if (!commandsRegexp.test(readmeContent)) {
			readmeContent = `${readmeContent}\n\n${newCommandsContent}`;
		} else {
			readmeContent = readmeContent.replace(commandsRegexp, newCommandsContent);
		}
		const settingsRegexp = new RegExp(`${Constants.settingsStart}${Constants.regexpAnything}${Constants.settingsEnd}`);
		if (!settingsRegexp.test(readmeContent)) {
			readmeContent = `${readmeContent}\n\n${newSettingsContent}`;
		} else {
			readmeContent = readmeContent.replace(settingsRegexp, newSettingsContent);
		}
		const colorsRegexp = new RegExp(`${Constants.colorsStart}${Constants.regexpAnything}${Constants.colorsEnd}`);
		if (!colorsRegexp.test(readmeContent)) {
			readmeContent = `${readmeContent}\n\n${newColorsContent}`;
		} else {
			readmeContent = readmeContent.replace(colorsRegexp, newColorsContent);
		}

		fs.writeFile(readmeUri.fsPath, readmeContent, err => {
			if (err) {
				window.showErrorMessage(err.message);
			}
		});
	} else {
		openInUntitled(commandsTable + settingsTable + colorsTable, 'markdown');
	}
}
