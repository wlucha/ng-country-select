import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Reads the peer dependencies of the library from its package.json.
 */
function getLibraryPeerDependencies(): Record<string, string> {
  const packageJsonPath = path.resolve(__dirname, '../../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.peerDependencies || {};
}

/**
 * Reads the Angular version used in the target project.
 */
function getAngularVersion(tree: Tree): string | null {
  const packageJsonPath = '/package.json';
  if (!tree.exists(packageJsonPath)) {
    return null;
  }

  const packageJsonBuffer = tree.read(packageJsonPath);
  if (!packageJsonBuffer) {
    return null;
  }

  const packageJson = JSON.parse(packageJsonBuffer.toString());
  return packageJson.dependencies?.['@angular/core'] || null;
}

/**
 * Dynamically adjusts Angular-related peer dependencies to match the target project's Angular version.
 */
function adjustAngularDependencies(
  peerDependencies: Record<string, string>,
  angularVersion: string
): Record<string, string> {
  const adjustedDependencies: Record<string, string> = { ...peerDependencies };

  Object.keys(peerDependencies).forEach((dependency) => {
    if (dependency.startsWith('@angular/')) {
      adjustedDependencies[dependency] = angularVersion;
    }
  });

  return adjustedDependencies;
}

/**
 * Adds dependencies to the project's package.json.
 */
function addPeerDependencies(
  tree: Tree,
  context: SchematicContext,
  dependencies: Record<string, string>
): void {
  const packageJsonPath = '/package.json';
  if (!tree.exists(packageJsonPath)) {
    context.logger.error('No package.json found in the project.');
    return;
  }

  const packageJsonBuffer = tree.read(packageJsonPath);
  if (!packageJsonBuffer) {
    context.logger.error('Failed to read package.json.');
    return;
  }

  const packageJson = JSON.parse(packageJsonBuffer.toString());

  // Merge dependencies into existing dependencies
  packageJson.dependencies = {
    ...packageJson.dependencies,
    ...dependencies,
  };

  tree.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

/**
 * Finds the default project or selects the first project in angular.json.
 */
function getDefaultProject(angularJson: { defaultProject?: string; projects?: Record<string, unknown> }): string | null {
  // Check if defaultProject is explicitly defined
  if (angularJson.defaultProject) {
    return angularJson.defaultProject;
  }

  // If no defaultProject is defined, select the first project in the list
  const projects = Object.keys(angularJson.projects || {});
  if (projects.length > 0) {
    return projects[0]; // Use the first project as a fallback
  }

  return null; // No projects found
}

/**
 * Adds the flag-icons stylesheet to the angular.json file.
 */
function addStylesToAngularJson(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const angularJsonPath = '/angular.json';

    // Check if angular.json exists
    if (!tree.exists(angularJsonPath)) {
      context.logger.error('Could not find angular.json. Are you sure this is an Angular project?');
      return tree;
    }

    const angularJsonBuffer = tree.read(angularJsonPath);
    if (!angularJsonBuffer) {
      context.logger.error('Failed to read angular.json.');
      return tree;
    }

    const angularJson = JSON.parse(angularJsonBuffer.toString());

    // Get the default project or fallback to the first available project
    const defaultProjectName = getDefaultProject(angularJson);
    if (!defaultProjectName) {
      context.logger.error('No projects found in angular.json.');
      return tree;
    }

    const project = angularJson.projects[defaultProjectName];
    if (!project) {
      context.logger.error(`Could not find configuration for project "${defaultProjectName}" in angular.json.`);
      return tree;
    }

    // Locate the styles array in the build options
    const styles = project.architect?.build?.options?.styles;
    if (!styles) {
      context.logger.error(
        `Could not find the "styles" array in the build options of project "${defaultProjectName}".`
      );
      return tree;
    }

    // Add the flag-icons stylesheet if it doesn't already exist
    const stylePath = 'flag-icons/css/flag-icons.min.css';
    if (!styles.includes(stylePath)) {
      styles.push(stylePath);
      context.logger.info(`Added "${stylePath}" to angular.json styles.`);
    } else {
      context.logger.info(`"${stylePath}" is already present in angular.json styles.`);
    }

    // Write back the updated angular.json
    tree.overwrite(angularJsonPath, JSON.stringify(angularJson, null, 2));
    return tree;
  };
}

/**
 * Adds outputHashing to the build configuration that corresponds to the default serve configuration.
 */
function addOutputHashingToBuild(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const angularJsonPath = '/angular.json';

    // Check if angular.json exists
    if (!tree.exists(angularJsonPath)) {
      context.logger.error('Could not find angular.json. Are you sure this is an Angular project?');
      return tree;
    }

    const angularJsonBuffer = tree.read(angularJsonPath);
    if (!angularJsonBuffer) {
      context.logger.error('Failed to read angular.json.');
      return tree;
    }

    const angularJson = JSON.parse(angularJsonBuffer.toString());

    // Get the default project or fallback to the first available project
    const defaultProjectName = getDefaultProject(angularJson);
    if (!defaultProjectName) {
      context.logger.error('No projects found in angular.json.');
      return tree;
    }

    const project = angularJson.projects[defaultProjectName];
    if (!project) {
      context.logger.error(`Could not find configuration for project "${defaultProjectName}" in angular.json.`);
      return tree;
    }

    // Check for serve configuration and its defaultConfiguration
    const serveConfig = project.architect?.serve;
    if (!serveConfig || !serveConfig.defaultConfiguration) {
      context.logger.error(
        `Could not find serve configuration or defaultConfiguration for project "${defaultProjectName}".`
      );
      return tree;
    }

    const defaultServeConfigName = serveConfig.defaultConfiguration;

    // Locate the corresponding build configuration
    const buildConfig = project.architect?.build;
    if (!buildConfig || !buildConfig.configurations || !buildConfig.configurations[defaultServeConfigName]) {
      context.logger.error(
        `Could not find build.configurations.${defaultServeConfigName} for project "${defaultProjectName}".`
      );
      return tree;
    }

    // Add or update outputHashing in the corresponding build configuration
    buildConfig.configurations[defaultServeConfigName].outputHashing = 'all';

    context.logger.info(
      `Added "outputHashing": "all" to build.configurations.${defaultServeConfigName} of project "${defaultProjectName}".`
    );

    // Write back updated angular.json
    tree.overwrite(angularJsonPath, JSON.stringify(angularJson, null, 2));

    return tree;
  };
}


/**
 * Main schematic rule for ng-add.
 */
export default function (): Rule {
  return (tree: Tree, context: SchematicContext) => {
    // Get library's peer dependencies
    const peerDependencies = getLibraryPeerDependencies();

    // Get Angular version used in target project
    const angularVersion = getAngularVersion(tree);
    if (!angularVersion) {
      context.logger.error('Could not determine Angular version. Ensure @angular/core is installed in your project.');
      return tree;
    }

    // Adjust Angular-related peer dependencies to match the target project's Angular version
    const adjustedDependencies = adjustAngularDependencies(peerDependencies, angularVersion);

    // Add peer dependencies to the target project's package.json
    addPeerDependencies(tree, context, adjustedDependencies);

    // Add styles to angular.json
    addStylesToAngularJson()(tree, context);

    // Add outputHashing to the build configuration that corresponds to the default serve configuration
    addOutputHashingToBuild()(tree, context);

    // Schedule npm install task
    context.addTask(new NodePackageInstallTask());

    context.logger.info('Installed @wlucha/ng-country-select and updated angular.json.');

    return tree;
  };
}
