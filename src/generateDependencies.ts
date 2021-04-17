import { IExtensionManifest } from 'src/types';
import { extensions } from 'vscode';

export interface Dependency2 {
	name: string;
	description: string;
}
export function generateDependencies(dependenciesContrib: NonNullable<IExtensionManifest['extensionDependencies']>) {
	const dependencies: Dependency2[] = [];

	for (const dep of dependenciesContrib) {
		const extension = extensions.getExtension(dep);
		if (!extension) {
			dependencies.push({
				name: dep,
				description: '',
			});
		} else {
			const packageJSON = extension.packageJSON as IExtensionManifest;
			let name = packageJSON.displayName || packageJSON.name;
			if (packageJSON.repository?.url) {
				name = `[${name}](${packageJSON.repository?.url})`;
			}
			dependencies.push({
				name,
				description: packageJSON.description || '',
			});
		}
	}

	return dependencies;
}
