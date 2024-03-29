import { $config } from './extension';
import { IExtensionContributions } from './types';

export interface Command2 {
	id: string;
	title: string;
}

export function generateCommands(commandsContrib: NonNullable<IExtensionContributions['commands']>): Command2[] {
	const commands = [];
	for (const commandContrib of commandsContrib) {
		if ($config.commands.excludeById.includes(commandContrib.command)) {
			continue;
		}
		commands.push({
			id: commandContrib.command,
			title: (commandContrib.category ? `${commandContrib.category}: ` : '') + (commandContrib.description || commandContrib.title),
		});
	}
	return commands;
}
