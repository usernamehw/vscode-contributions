import { markdownTable } from 'markdown-table';
import { IExtensionContributions } from 'src/types';
import { getMarkdownTableOptions, wrapInBackticks } from 'src/utils';

export function generateColors(colorsContrib: IExtensionContributions['colors']) {
	if (!colorsContrib) {
		return '';
	}

	const colors = [];

	for (const color of colorsContrib) {
		colors.push({
			id: color.id,
			dark: color.defaults.dark,
			light: color.defaults.light,
			hc: color.defaults.highContrast,
			description: color.description,
		});
	}

	return markdownTable([
		['Color', 'Dark', 'Light', 'HC', 'Description'],
		...colors.map(color => [
			wrapInBackticks(color.id),
			wrapInBackticks(color.dark),
			wrapInBackticks(color.light),
			wrapInBackticks(color.hc),
			color.description,
		]),
	], getMarkdownTableOptions());
}
