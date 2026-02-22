# Contributing to ng-country-select

Thanks for your interest in contributing! 🎉 Every contribution — whether a bug fix, feature, or docs improvement — is valuable.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or later
- npm v10 or later
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)

### Setup

```bash
# Clone the repository
git clone https://github.com/wlucha/ng-country-select.git
cd ng-country-select

# Install dependencies
npm install
```

### Project Structure

```
ng-country-select/
├── src/                          # Demo application
├── projects/wlucha/ng-country-select/
│   ├── src/lib/                  # Library source code
│   ├── schematics/               # ng add schematic
│   └── package.json              # Library package.json
├── .github/workflows/            # CI pipeline
└── package.json                  # Root workspace config
```

## 🛠️ Development Workflow

### Running the Demo App

```bash
npm start
```

The demo app will be available at `http://localhost:4200`.

### Building the Library

```bash
npm run build:lib
npm run build:schematics
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## 📝 Making Changes

1. **Fork** the repository and create a **feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** — keep commits focused and atomic.

3. **Follow the code style** — run `npm run lint` and fix any issues.

4. **Add or update tests** for any new functionality.

5. **Ensure all checks pass** before submitting:
   ```bash
   npm run lint
   npm test
   npm run build:lib
   ```

6. **Submit a Pull Request** against `main` with a clear description of your changes.

## 📐 Code Guidelines

- **Angular best practices** — use `OnPush` change detection, standalone components, and signals where appropriate.
- **Commit messages** — use [Conventional Commits](https://www.conventionalcommits.org/) format:
  - `feat: add new input property`
  - `fix: correct filter logic`
  - `docs: update README examples`
  - `chore: update dependencies`
- **TypeScript** — avoid `any` types; use proper typing.
- **Tests** — write meaningful tests for new features and bug fixes.

## 🐛 Reporting Bugs

Open an issue using the [bug report template](https://github.com/wlucha/ng-country-select/issues/new?template=bug_report.md). Include:

- A clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Angular version and browser info

## 💡 Suggesting Features

Open an issue using the [feature request template](https://github.com/wlucha/ng-country-select/issues/new?template=feature_request.md). Describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
