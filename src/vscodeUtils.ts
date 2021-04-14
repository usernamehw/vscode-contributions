import { window, workspace } from 'vscode';

/**
 * Create new untitled file with provided content and language;
 */
export async function openInUntitled(content: string, language?: string) {
	const document = await workspace.openTextDocument({
		language,
		content,
	});
	return window.showTextDocument(document);
}
