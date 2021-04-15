import { IExtensionContributions } from 'src/types';

export interface Command2 {
	id: string;
	title: string;
}

export function generateCommands(commandsContrib: NonNullable<IExtensionContributions['commands']>): Command2[] {
	const commands = [];
	for (const commandContrib of commandsContrib) {
		commands.push({
			id: commandContrib.command,
			title: (commandContrib.category ? `${commandContrib.category}: ` : '') + commandContrib.title,
		});
	}
	return commands;
}
