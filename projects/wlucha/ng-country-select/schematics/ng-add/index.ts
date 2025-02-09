import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

function getAngularVersion(host: Tree, context: SchematicContext): number | null {
  const packageJsonPath = '/package.json';
  const buffer = host.read(packageJsonPath);
  if (!buffer) {
    context.logger.error('No package.json found in the project.');
    return null;
  }
  const packageJson = JSON.parse(buffer.toString());
  const angularCoreVersion = packageJson.dependencies?.['@angular/core'] || packageJson.devDependencies?.['@angular/core'];
  if (!angularCoreVersion) {
    context.logger.error('@angular/core is not listed as a dependency.');
    return null;
  }
  const match = angularCoreVersion.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function addPackageToPackageJson(
  host: Tree,
  context: SchematicContext,
  pkg: string,
  version: string
): void {
  const packageJsonPath = '/package.json';
  const buffer = host.read(packageJsonPath);
  if (!buffer) {
    context.logger.error('No package.json found in the project.');
    return;
  }
  const packageJson = JSON.parse(buffer.toString());
  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }
  if (!packageJson.dependencies[pkg]) {
    packageJson.dependencies[pkg] = version;
    host.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));
    context.logger.info(`✅️ Added "${pkg}@${version}" to dependencies.`);
  } else {
    context.logger.info(`ℹ️ "${pkg}" is already present.`);
  }
}

export function ngAdd(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const angularVersion = getAngularVersion(host, context);
    if (!angularVersion) {
      context.logger.error('Unable to determine Angular version.');
      return host;
    }

    context.logger.info(`Detected Angular version: ${angularVersion}`);

    const dependencies = [
      { name: '@angular/material', version: `^${angularVersion}.0.0` },
      { name: '@angular/cdk', version: `^${angularVersion}.0.0` },
      { name: '@angular/animations', version: `^${angularVersion}.0.0` },
    ];

    dependencies.forEach(dependency => {
      addPackageToPackageJson(host, context, dependency.name, dependency.version);
    });

    // Add a task to install npm packages
    context.addTask(new NodePackageInstallTask());

    return host;
  };
}
