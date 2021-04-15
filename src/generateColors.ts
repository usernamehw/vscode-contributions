import { IExtensionContributions } from 'src/types';

export interface Color2 {
	id: string;
	dark: string;
	light: string;
	hc: string;
	description: string;
}

export function generateColors(colorsContrib: NonNullable<IExtensionContributions['colors']>): Color2[] {
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

	return colors;
}
