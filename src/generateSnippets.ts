import fs from 'fs';
import { parse } from 'jsonc-parser';
import path from 'path';
import { IExtensionContributions } from 'src/types';

export interface Snippet2 {
	prefix: string;
	body: string;
	description: string;
}

interface SnippetObj {
	[key: string]: {
		prefix: string[] | string;
		body: string[] | string;
		description?: string;
	};
}

export function generateSnippets(snippetsContrib: NonNullable<IExtensionContributions['snippets']>, extensionPath: string): Snippet2[] {
	const snippets: Snippet2[] = [];
	for (const snippetFile of snippetsContrib) {
		const snippetFilePath = path.join(extensionPath, snippetFile.path);
		if (fs.existsSync(snippetFilePath)) {
			// const language = path.parse(path.basename(sn.path)).name;
			const snippetFileContents = fs.readFileSync(snippetFilePath).toString();
			const snippetFileObject: SnippetObj = parse(snippetFileContents);
			for (const key in snippetFileObject) {
				const snippet = snippetFileObject[key];
				const prefix = Array.isArray(snippet.prefix) ? snippet.prefix.map(p => `\`${p}\``).join(' ') : snippet.prefix;
				const body = Array.isArray(snippet.body) ? snippet.body.map(b => `\`${b}\``).join('<br>') : snippet.body;

				snippets.push({
					prefix,
					body,
					description: snippet.description || '',
				});
			}
		}
	}

	return snippets;
}
