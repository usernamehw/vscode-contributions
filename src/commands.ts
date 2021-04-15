import { extensionConfig } from 'src/extension';
import { mdTable } from 'src/extensionUtils';
import { Color2, generateColors } from 'src/generateColors';
import { Command2, generateCommands } from 'src/generateCommands';
import { generateSettings, Setting2 } from 'src/generateSettings';
import { IExtensionManifest } from 'src/types';
import { wrapInBackticks, wrapInDetailsTag } from 'src/utils';
import { openInUntitled } from 'src/vscodeUtils';
import { commands, Disposable, Uri, window, workspace } from 'vscode';

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
		const commands2: Command2[] = contributes.commands ? generateCommands(contributes.commands) : [];
		const settings2: Setting2[] = contributes.configuration ? generateSettings(contributes.configuration) : [];
		const colors2: Color2[] = contributes.colors ? generateColors(contributes.colors) : [];

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

		openInUntitled(`
## Commands

${commandsTable}

## Settings

${settingsTable}

## Colors

${colorsTable}
`.trim(), 'markdown');
	}));
}
