import { Snippet2 } from 'src/generateSnippets';

export function generateSnippetsHtmlTable(snippets: Snippet2[]) {
	let tableStr = '<table>';
	tableStr += '<tr>';
	tableStr += '<th>Prefix</th>';
	tableStr += '<th>Body</th>';
	tableStr += '<th>Description</th>';
	tableStr += '</tr>';
	for (const snippet of snippets) {
		tableStr += '<tr>';
		tableStr += `<td>${snippet.prefix}</td>`;
		tableStr += `<td>

\`\`\`${snippet.language}
${snippet.body}
\`\`\`

`;
		tableStr += '</td>';
		tableStr += `<td>${snippet.description}</td>`;
		tableStr += '</tr>';
	}
	tableStr += '</table>';
	return tableStr;
}
