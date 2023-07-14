import { ConfigurationChangeEvent, ExtensionContext, workspace } from 'vscode';
import { registerAllCommands } from './commands';
import { ExtensionConfig } from './types';

export const EXTENSION_NAME = 'contributions';
export let $config = workspace.getConfiguration(EXTENSION_NAME) as any as ExtensionConfig;

export abstract class $state {
	static extensionContext: ExtensionContext;
}

export function activate(extensionContext: ExtensionContext) {
	$state.extensionContext = extensionContext;
	updateEverything();

	function onConfigChange(event: ConfigurationChangeEvent) {
		if (!event.affectsConfiguration(EXTENSION_NAME)) {
			return;
		}
		updateConfigAndEverything();
	}

	function updateConfigAndEverything(): void {
		$config = workspace.getConfiguration(EXTENSION_NAME) as any as ExtensionConfig;
		updateEverything();
	}

	workspace.onDidChangeConfiguration(onConfigChange);
}

function disposeEverything() {
	for (const disposable of $state.extensionContext.subscriptions) {
		disposable?.dispose();
	}
}

function updateEverything() {
	disposeEverything();
	registerAllCommands($state.extensionContext.subscriptions);
}

export function deactivate(): void { }
