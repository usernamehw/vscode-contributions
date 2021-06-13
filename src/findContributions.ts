import { IExtensionManifest } from 'src/types';
import { Uri, window, workspace } from 'vscode';

/**
 * Find contributions in opened workspace.
 *
 * 1. Find `package.json` file
 * 2. JSON.parse() it
 */
export async function findContributions() {
	const packageJsonFiles = await workspace.findFiles('package.json');

	if (packageJsonFiles.length === 0) {
		window.showWarningMessage('Cannot find `package.json`');
		return undefined;
	}

	let targetPackageJsonPath;
	if (packageJsonFiles.length > 1) {
		const pickedFile = await window.showQuickPick(packageJsonFiles.map(file => file.fsPath));
		if (!pickedFile) {
			return undefined;
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
		return undefined;
	}
	let parsedJson: IExtensionManifest;
	try {
		parsedJson = JSON.parse(targetJson.toString());
	} catch (e: unknown) {
		window.showErrorMessage(`Invalid JSON. Parsing of "${targetPackageJsonPath}" failed.`);
		window.showErrorMessage(String(e));
		return undefined;
	}

	const { contributes } = parsedJson;
	if (!contributes) {
		window.showInformationMessage('No contributions');
		return undefined;
	}
	return {
		contributes,
		parsedJson,
		targetPackageJsonPath,
	};
}
