import { MarkdownTableOptions } from 'markdown-table';
import { extensionConfig } from 'src/extension';

export function ln2br(str: string) {
	return str.replace(/\n/g, '<br>');
}

export function mdln2br(str: string) {
	return str.replace(/\n\n/g, '<br>');
}

export function truncateString(str: string, charLimit: number): string {
	return str.length > charLimit ? `${str.slice(0, charLimit)}…` : str;
}

export function getMarkdownTableOptions(): MarkdownTableOptions {
	return {
		alignDelimiters: extensionConfig.alignDelimiters,
		padding: extensionConfig.addPadding,
		delimiterEnd: extensionConfig.addStartEndDelimiters,
		delimiterStart: extensionConfig.addStartEndDelimiters,
	};
}

export function wrapInBackticks(str: string) {
	return `\`${str}\``;
}

export function wrapInDetailsTag(text: string, header: string) {
	return `<details><summary>${header} list</summary>

${text}

</details>`;
}

export function escapeVerticalBar(str: string) {
	return str.replace(/\|/g, '\\|');
}

export function removePrefix(str: string, prefix: string) {
	return str.replace(prefix, '');
}

export function removeLastChar(str: string) {
	return str.slice(0, -1);
}

export function findCommonPrefix(strings: string[]) {
	let prefix = '';
	for (let i = 0; i < strings[0].length; i++) {
		const char = strings[0][i];
		for (let j = 1; j < strings.length; j++) {
			if (strings[j][i] !== char) {
				return prefix;
			}
		}
		prefix += char;
	}
	return prefix;
}
