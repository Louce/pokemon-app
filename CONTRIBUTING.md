# Contributing to Pokémon Explorer App

Thank you for considering contributing to the Pokémon Explorer App! Your help is essential for making this project better for everyone.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers understand your report, reproduce the behavior, and find related reports.

* **Use the GitHub issue search** — check if the issue has already been reported.
* **Check if the issue has been fixed** — try to reproduce it using the latest `main` branch.
* **Isolate the problem** — create a reduced test case and a live example.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

* **Use the GitHub issue search** — check if the enhancement has already been suggested.
* **Describe the enhancement in detail** — provide a step-by-step description of the suggested enhancement in as much detail as possible.
* **Explain why this enhancement would be useful** — which use cases would this enhancement serve?

### Pull Requests

* Fill in the required template
* Follow the JavaScript/TypeScript styleguide
* Include appropriate test cases
* End all files with a newline
* Place imports in the following order:
  * React and related packages
  * External packages
  * Internal modules
  * Local components

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
  * 🎨 `:art:` when improving the format/structure of the code
  * 🚀 `:rocket:` when improving performance
  * 📝 `:memo:` when writing docs
  * 🐛 `:bug:` when fixing a bug
  * ✨ `:sparkles:` when adding a new feature

### JavaScript/TypeScript Styleguide

* Use 2 spaces for indentation
* Use single quotes for strings
* Prefer arrow functions over function expressions
* Use template literals instead of string concatenation
* Use destructuring when possible
* Use the spread operator when appropriate
* Use meaningful variable names
* Add trailing commas for cleaner diffs

### Testing Styleguide

* Place tests in a `__tests__` folder or a `.test.ts(x)` file alongside the code being tested
* Treat `describe` as a noun or situation
* Treat `it` as a statement about state or how an operation changes state
* Use meaningful test names

## Development Setup

To set up the project for local development:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Project Structure

Understanding the project structure will help you navigate and contribute more effectively:

- `/src/components` - Reusable UI components
- `/src/pages` - Page components for different routes
- `/src/hooks` - Custom React hooks
- `/src/services` - API service functions
- `/src/utils` - Utility functions and helpers
- `/src/contexts` - React context providers
- `/src/redux` - Redux state management

Thank you for contributing! 