import { markdownTable } from 'markdown-table';
import { $config } from './extension';
import { escapeVerticalBar } from './utils';

export function mdTable(rows: string[][]) {
	const escapedRows = rows.map(row => row.map(item => escapeVerticalBar(item)));

	return markdownTable(escapedRows, {
		alignDelimiters: $config.alignDelimiters,
		padding: $config.addPadding,
		delimiterEnd: $config.addStartEndDelimiters,
		delimiterStart: $config.addStartEndDelimiters,
	});
}
