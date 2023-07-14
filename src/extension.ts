import { ConfigurationChangeEvent, ExtensionContext, workspace } from 'vscode';
import { registerAllCommands } from './commands';
import { ExtensionConfig } from './types';

export const EXTENSION_NAME = 'contributions';
export let extensionConfig = workspace.getConfiguration(EXTENSION_NAME) as any as ExtensionConfig;

export class Global {
	static extensionContext: ExtensionContext;
}

export function activate(extensionContext: ExtensionContext) {
	Global.extensionContext = extensionContext;
	updateEverything();

	function onConfigChange(event: ConfigurationChangeEvent) {
		if (!event.affectsConfiguration(EXTENSION_NAME)) {
			return;
		}
		updateConfigAndEverything();
	}

	function updateConfigAndEverything(): void {
		extensionConfig = workspace.getConfiguration(EXTENSION_NAME) as any as ExtensionConfig;
		updateEverything();
	}

	workspace.onDidChangeConfiguration(onConfigChange);
}

function disposeEverything() {
	for (const disposable of Global.extensionContext.subscriptions) {
		disposable?.dispose();
	}
}

function updateEverything() {
	disposeEverything();
	registerAllCommands(Global.extensionContext.subscriptions);
}

export function deactivate(): void { }
