import { generateContributions } from './generateContributions';
import { commands, Disposable } from 'vscode';

export const enum Constants {
	'Settings' = 'Settings',
	'Commands' = 'Commands',
	'Snippets' = 'Snippets',
	'Colors' = 'Colors',
	ExtensionDependencies = 'Extension Dependencies',
	commandsStart = '<!-- COMMANDS_START -->',
	commandsEnd = '<!-- COMMANDS_END -->',
	settingsStart = '<!-- SETTINGS_START -->',
	settingsEnd = '<!-- SETTINGS_END -->',
	snippetsStart = '<!-- SNIPPETS_START -->',
	snippetsEnd = '<!-- SNIPPETS_END -->',
	colorsStart = '<!-- COLORS_START -->',
	colorsEnd = '<!-- COLORS_END -->',
	dependenciesStart = '<!-- DEPENDENCIES_START -->',
	dependenciesEnd = '<!-- DEPENDENCIES_END -->',
	regexpAnything = '[\\s\\S]*?',
}

export function registerAllCommands(subscriptions: Disposable[]) {
	subscriptions.push(commands.registerCommand('contributions.generate', async () => {
		await generateContributions({
			where: 'workspace',
			forUntitled: false,
		});
	}));
	subscriptions.push(commands.registerCommand('contributions.generateUntitled', async () => {
		await generateContributions({
			where: 'workspace',
			forUntitled: true,
		});
	}));
	subscriptions.push(commands.registerCommand('contributions.generateForInstalled', async () => {
		await generateContributions({
			where: 'extension',
			forUntitled: true,
		});
	}));
	subscriptions.push(commands.registerCommand('contributions.generateForAllInstalled', async () => {
		await generateContributions({
			where: 'allExtensions',
			forUntitled: true,
		});
	}));
}
