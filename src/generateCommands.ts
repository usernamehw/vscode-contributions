import { markdownTable } from 'markdown-table';
import { extensionConfig } from 'src/extension';
import { IExtensionContributions } from 'src/types';
import { getMarkdownTableOptions, wrapInBackticks } from 'src/utils';

export function generateCommands(commandsContrib: IExtensionContributions['commands']) {
	if (!commandsContrib) {
		return '';
	}
	const commands = [];
	for (const commandContrib of commandsContrib) {
		commands.push({
			id: commandContrib.command,
			title: (commandContrib.category ? `${commandContrib.category}: ` : '') + commandContrib.title,
		});
	}

	if (extensionConfig.sort === 'alphabetical') {
		commands.sort((a, b) => a.title.localeCompare(b.title));
	}

	return markdownTable([
		['Id', 'Title'],
		...commands.map(command => [
			wrapInBackticks(command.id),
			command.title,
		]),
	], getMarkdownTableOptions());
}
