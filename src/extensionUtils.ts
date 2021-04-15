import { markdownTable } from 'markdown-table';
import { extensionConfig } from 'src/extension';

export function mdTable(rows: string[][]) {
	return markdownTable(rows, {
		alignDelimiters: extensionConfig.alignDelimiters,
		padding: extensionConfig.addPadding,
		delimiterEnd: extensionConfig.addStartEndDelimiters,
		delimiterStart: extensionConfig.addStartEndDelimiters,
	});
}
