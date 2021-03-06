import { markdownTable } from 'markdown-table';
import { extensionConfig } from 'src/extension';
import { escapeVerticalBar } from 'src/utils';

export function mdTable(rows: string[][]) {
	const escapedRows = rows.map(row => row.map(item => escapeVerticalBar(item)));

	return markdownTable(escapedRows, {
		alignDelimiters: extensionConfig.alignDelimiters,
		padding: extensionConfig.addPadding,
		delimiterEnd: extensionConfig.addStartEndDelimiters,
		delimiterStart: extensionConfig.addStartEndDelimiters,
	});
}
