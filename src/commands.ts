import { extensionConfig } from 'src/extension';
import { generateColors } from 'src/generateColors';
import { generateCommands } from 'src/generateCommands';
import { generateSettings } from 'src/generateSettings';
import { IExtensionManifest } from 'src/types';
import { wrapInDetailsTag } from 'src/utils';
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
		let commandsTable = generateCommands(contributes.commands);
		let settingsTable = generateSettings(contributes.configuration);
		let colorsTable = generateColors(contributes.colors);

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
