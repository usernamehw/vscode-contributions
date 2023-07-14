import fs from 'fs';
import path from 'path';
import { QuickPickItem, Uri, extensions, window, workspace } from 'vscode';
import { Constants } from './commands';
import { contributionsToStrings } from './contributionsToString';
import { extensionConfig } from './extension';
import { findContributions } from './findContributions';
import { IExtensionContributions, IExtensionManifest } from './types';
import { removeLastChar } from './utils';
import { openInEditor, openInUntitled } from './vscodeUtils';

export async function generateContributions({ where, forUntitled }: { where: 'allExtensions' | 'extension' | 'workspace'; forUntitled: boolean }) {
	let contributes: IExtensionContributions | undefined;
	let parsedJson: IExtensionManifest | undefined;
	let rootPackagePath: string | undefined;
	if (where === 'workspace') {
		const contributions = await findContributions();
		if (contributions) {
			contributes = contributions.contributes;
			parsedJson = contributions.parsedJson;
			rootPackagePath = path.join(contributions.targetPackageJsonPath, '..');
		}
	} else if (where === 'extension') {
		const itemsForQuickPick: QuickPickItem[] = extensions.all.map(ext => ({
			label: (ext.packageJSON as IExtensionManifest).displayName || (ext.packageJSON as IExtensionManifest).name,
			detail: ext.id,
		}));

		const picked = await window.showQuickPick(itemsForQuickPick, {
			matchOnDescription: true,
			matchOnDetail: true,
		});
		if (!picked) {
			return;
		}

		const pickedExtension = extensions.getExtension(picked.detail!);
		contributes = (pickedExtension?.packageJSON as IExtensionManifest).contributes;
		rootPackagePath = pickedExtension?.extensionPath;
		parsedJson = pickedExtension?.packageJSON;
	} else if (where === 'allExtensions') {
		let text = '';
		for (const ext of extensions.all) {
			const extPackageJSON = ext?.packageJSON as IExtensionManifest;
			const extContributes = extPackageJSON.contributes;
			if (!extContributes || !extPackageJSON || !ext.extensionPath) {
				continue;
			}

			const { commandsTable, settingsTable, snippetsTable, colorsTable, dependenciesTable, commands2, settings2, snippets2, colors2, dependencies2 } = contributionsToStrings(extContributes, extPackageJSON, ext.extensionPath);
			if (commands2.length + settings2.length + snippets2.length + colors2.length + dependencies2.length) {
				// Only if any contribution exists
				text += `# ${extPackageJSON.displayName} \`${extPackageJSON.publisher}.${extPackageJSON.name}\`\n\n${(commandsTable + settingsTable + snippetsTable + colorsTable + dependenciesTable).trim()}\n\n\n`;
			}
		}
		openInUntitled(text, 'markdown');
		return;
	}

	if (!contributes || !parsedJson || !rootPackagePath) {
		return;
	}

	const { commandsTable, settingsTable, snippetsTable, colorsTable, dependenciesTable, commands2, settings2, snippets2, colors2, dependencies2 } = contributionsToStrings(contributes, parsedJson, rootPackagePath);

	if (forUntitled) {
		openInUntitled((commandsTable + settingsTable + snippetsTable + colorsTable + dependenciesTable).trim(), 'markdown');
	} else {
		// ──── Write README file ─────────────────────────────────────
		const reamdeFiles = await workspace.findFiles('README.md');
		if (!reamdeFiles.length) {
			window.showErrorMessage('Cannot find any README files');
			return;
		}
		let readmePath = reamdeFiles[0].fsPath;
		if (reamdeFiles.length > 1) {
			const itemsForQuickPick: QuickPickItem[] = reamdeFiles.map(uri => ({
				label: uri.fsPath,
			}));

			const picked = await window.showQuickPick(itemsForQuickPick, {
				matchOnDescription: true,
				matchOnDetail: true,
			});
			if (!picked) {
				return;
			}
			readmePath = picked.label;
		}
		const readmeUri = Uri.file(readmePath);
		let readmeContent = (await workspace.fs.readFile(readmeUri)).toString();

		const newCommandsContent = commands2.length ? `${Constants.commandsStart}\n${removeLastChar(commandsTable)}${Constants.commandsEnd}` : '';
		const newSettingsContent = settings2.length ? `${Constants.settingsStart}\n${removeLastChar(settingsTable)}${Constants.settingsEnd}` : '';
		const newSnippetsContent = snippets2.length ? `${Constants.snippetsStart}\n${removeLastChar(snippetsTable)}${Constants.snippetsEnd}` : '';
		const newColorsContent = colors2.length ? `${Constants.colorsStart}\n${removeLastChar(colorsTable)}${Constants.colorsEnd}` : '';
		const newDependenciesContent = dependencies2.length ? `${Constants.dependenciesStart}\n${removeLastChar(dependenciesTable)}${Constants.dependenciesEnd}` : '';

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
		const snippetsRegexp = new RegExp(`${Constants.snippetsStart}${Constants.regexpAnything}${Constants.snippetsEnd}`);
		if (!snippetsRegexp.test(readmeContent)) {
			readmeContent = `${readmeContent}\n\n${newSnippetsContent}`;
		} else {
			readmeContent = readmeContent.replace(snippetsRegexp, newSnippetsContent);
		}
		const colorsRegexp = new RegExp(`${Constants.colorsStart}${Constants.regexpAnything}${Constants.colorsEnd}`);
		if (!colorsRegexp.test(readmeContent)) {
			readmeContent = `${readmeContent}\n\n${newColorsContent}`;
		} else {
			readmeContent = readmeContent.replace(colorsRegexp, newColorsContent);
		}
		const dependenciesRegexp = new RegExp(`${Constants.dependenciesStart}${Constants.regexpAnything}${Constants.dependenciesEnd}`);
		if (!dependenciesRegexp.test(readmeContent)) {
			readmeContent = `${readmeContent}\n\n${newDependenciesContent}`;
		} else {
			readmeContent = readmeContent.replace(dependenciesRegexp, newDependenciesContent);
		}

		fs.writeFile(readmeUri.fsPath, readmeContent.trim(), async err => {
			if (err) {
				window.showErrorMessage(err.message);
			}
			if (extensionConfig.doOnCompletion === 'openReadmeFile') {
				openInEditor(readmeUri);
			} else if (extensionConfig.doOnCompletion === 'showNotification') {
				const openBtn = 'Open README';
				const pressed = await window.showInformationMessage('✅  Done', openBtn);
				if (pressed === openBtn) {
					openInEditor(readmeUri);
				}
			}
		});
	}
}
