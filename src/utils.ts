import { MarkdownString } from 'vscode';

/**
 * Replace all `\n` with `<br>`
 */
export function ln2br(str: string) {
	return str.replace(/\n/g, '<br>');
}
/**
 * Replace all `\n\n` with `<br>`
 */
export function mdln2br(str: string) {
	return str.replace(/\n\n/g, '<br>');
}
/**
 * Truncate string bigger that passed charLimit
 */
export function truncateString(str: string, charLimit: number): string {
	return str.length > charLimit ? `${str.slice(0, charLimit)}…` : str;
}
/**
 * Wrap string at both sides with passed character(s).
 */
export function wrapIn(str: string, wrapper: string) {
	return `${wrapper}${str}${wrapper}`;
}
/**
 * Wrap content in `<details>`/`<summary>` tags
 */
export function wrapInDetailsTag(text: string, header: string) {
	return `<details><summary>${header} list</summary>

${text}

</details>`;
}
/**
 * Replace all `|` with `\|`
 */
export function escapeVerticalBar(str = '') {
	return str.replace(/\|/g, '\\|');
}
export function escapeMarkdown(str = '') {
	const md = new MarkdownString();
	md.appendText(str);
	return md.value;
}
export function escapeBackticks(str = '') {
	return str.replace(/`/g, '\\`');
}
/**
 * Remove prefix from the string.
 */
export function removePrefix(str: string, prefix: string) {
	return str.replace(prefix, '');
}
/**
 * Remove last character from the string.
 */
export function removeLastChar(str: string) {
	return str.slice(0, -1);
}
/**
 * Find common prefix for an array of strings.
 */
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
