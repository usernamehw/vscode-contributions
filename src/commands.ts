import { extensionConfig } from 'src/extension';
import { mdTable } from 'src/extensionUtils';
import { Color2, generateColors } from 'src/generateColors';
import { Command2, generateCommands } from 'src/generateCommands';
import { generateSettings, Setting2 } from 'src/generateSettings';
import { IExtensionContributions, IExtensionManifest } from 'src/types';
import { wrapInBackticks, wrapInDetailsTag } from 'src/utils';
import { openInUntitled } from 'src/vscodeUtils';
import { commands, Disposable, extensions, QuickPickItem, Uri, window, workspace } from 'vscode';

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
		generateContributions(contributes);
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
			generateContributions(contributions);
		}
	}));
}

function generateContributions(contributions: IExtensionContributions) {
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
	let settingsTable = mdTable([
		['Setting', 'Type', 'Default', 'Description'],
		...settings2.map(item => [
			item.id,
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

	if (extensionConfig.wrapInDetailsTag) {
		commandsTable = wrapInDetailsTag(commandsTable, 'Commands');
		settingsTable = wrapInDetailsTag(settingsTable, 'Settings');
		colorsTable = wrapInDetailsTag(colorsTable, 'Colors');
	}

	commandsTable = commands2.length ? `## Commands (${commands2.length})\n\n${commandsTable}\n\n` : '';
	settingsTable = settings2.length ? `## Settings (${settings2.length})\n\n${settingsTable}\n\n` : '';
	colorsTable = colors2.length ? `## Colors (${colors2.length})\n\n${colorsTable}\n\n` : '';

	openInUntitled(commandsTable + settingsTable + colorsTable, 'markdown');
}
