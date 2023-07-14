export interface ExtensionConfig {
	sort: 'alphabetical' | 'default';
	doOnCompletion: 'nothing' | 'openReadmeFile' | 'showNotification';
	wrapInDetailsTag: boolean;
	alignDelimiters: boolean;
	addPadding: boolean;
	addStartEndDelimiters: boolean;

	commands: {
		excludeById: string[];
	};
	snippets: {
		includeBody: boolean;
	};
	settings: {
		excludeById: string[];
		replaceDefaultValue: Record<string, string>;
		moveOutPrefix: boolean;
		includeTypes: boolean;
		truncateDefaultValue: number;
		truncateDescription: number;
	};
}


// https://github.com/microsoft/vscode/blob/main/src/vs/platform/extensions/common/extensions.ts

export interface ICommand {
	command: string;
	title: string;
	/** Non-standard */
	description?: string;
	category?: string;
}

export interface IConfigurationProperty {
	description?: string;
	markdownDescription?: string;
	type?: string[] | string;
	default?: any;
	deprecationMessage?: string;
	markdownDeprecationMessage?: string;
}

export interface IConfiguration {
	properties: { [key: string]: IConfigurationProperty };
}

export interface IDebugger {
	label?: string;
	type: string;
	runtime?: string;
}

export interface IGrammar {
	language: string;
}

export interface IJSONValidation {
	fileMatch: string[] | string;
	url: string;
}

export interface IKeyBinding {
	command: string;
	key: string;
	when?: string;
	mac?: string;
	linux?: string;
	win?: string;
}

export interface ILanguage {
	id: string;
	extensions: string[];
	aliases: string[];
}

export interface IMenu {
	command: string;
	alt?: string;
	when?: string;
	group?: string;
}

export interface ISnippet {
	language: string;
	path: string;
}

export interface ITheme {
	label: string;
}

export interface IViewContainer {
	id: string;
	title: string;
}

export interface IView {
	id: string;
	name: string;
}

export interface IColor {
	id: string;
	description: string;
	defaults: { light: string; dark: string; highContrast: string };
}

export interface IWebviewEditor {
	readonly viewType: string;
	readonly priority: string;
	readonly selector: readonly {
		readonly filenamePattern?: string;
	}[];
}

export interface ICodeActionContributionAction {
	readonly kind: string;
	readonly title: string;
	readonly description?: string;
}

export interface ICodeActionContribution {
	readonly languages: readonly string[];
	readonly actions: readonly ICodeActionContributionAction[];
}

export interface IAuthenticationContribution {
	readonly id: string;
	readonly label: string;
}

export interface IWalkthroughTask {
	readonly id: string;
	readonly title: string;
	readonly description: string;
	readonly button:
	{ title: string; command: string; link?: never } | { title: string; link: string; command?: never };
	readonly media: { path: string; altText: string };
	readonly doneOn?: { command: string };
	readonly when?: string;
}

export interface IWalkthrough {
	readonly id: string;
	readonly title: string;
	readonly description: string;
	readonly tasks: IWalkthroughTask[];
	readonly primary?: boolean;
	readonly when?: string;
}

export interface IExtensionContributions {
	commands?: ICommand[];
	configuration?: IConfiguration | IConfiguration[];
	debuggers?: IDebugger[];
	grammars?: IGrammar[];
	jsonValidation?: IJSONValidation[];
	keybindings?: IKeyBinding[];
	languages?: ILanguage[];
	menus?: { [context: string]: IMenu[] };
	snippets?: ISnippet[];
	themes?: ITheme[];
	iconThemes?: ITheme[];
	productIconThemes?: ITheme[];
	viewsContainers?: { [location: string]: IViewContainer[] };
	views?: { [location: string]: IView[] };
	colors?: IColor[];
	// localizations?: ILocalization[];
	readonly customEditors?: readonly IWebviewEditor[];
	readonly codeActions?: readonly ICodeActionContribution[];
	authentication?: IAuthenticationContribution[];
	walkthroughs?: IWalkthrough[];
}

export type ExtensionKind = 'ui' | 'web' | 'workspace';
export type ExtensionWorkspaceTrustRequirement = 'onDemand' | 'onStart' | false;
export interface ExtensionWorkspaceTrust { required: ExtensionWorkspaceTrustRequirement; description?: string }

export function isIExtensionIdentifier(thing: any): thing is IExtensionIdentifier {
	return thing &&
		typeof thing === 'object' &&
		typeof thing.id === 'string' &&
		(!thing.uuid || typeof thing.uuid === 'string');
}

export interface IExtensionIdentifier {
	id: string;
	uuid?: string;
}

export interface IExtensionManifest {
	readonly name: string;
	readonly displayName?: string;
	readonly publisher: string;
	readonly version: string;
	readonly engines: { readonly vscode: string };
	readonly description?: string;
	readonly main?: string;
	readonly browser?: string;
	readonly icon?: string;
	readonly categories?: string[];
	readonly keywords?: string[];
	readonly activationEvents?: string[];
	readonly extensionDependencies?: string[];
	readonly extensionPack?: string[];
	readonly extensionKind?: ExtensionKind | ExtensionKind[];
	readonly contributes?: IExtensionContributions;
	readonly repository?: { url: string };
	readonly bugs?: { url: string };
	readonly enableProposedApi?: boolean;
	readonly api?: string;
	readonly scripts?: { [key: string]: string };
	readonly workspaceTrust?: ExtensionWorkspaceTrust;
}

export const enum ExtensionType {
	System,
	User,
}

// export interface IExtension {
// 	readonly type: ExtensionType;
// 	readonly isBuiltin: boolean;
// 	readonly identifier: IExtensionIdentifier;
// 	readonly manifest: IExtensionManifest;
// 	readonly location: URI;
// 	readonly readmeUrl?: URI;
// 	readonly changelogUrl?: URI;
// }
