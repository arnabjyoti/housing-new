# Project Workspace Instructions (ECC + Antigravity)

This repository (`udhousing-new`) uses the **ECC (Everything Claude Code / Everything Coding Harness)** performance optimization and engineering system integrated with Google Antigravity.

## Architecture

- **Frontend**: Angular 16 (`frontend/`), TypeScript, Angular Material, Bootstrap, RxJS
- **Backend**: Node.js & Express (`backend/`), Sequelize ORM, MySQL database
- **Agent Harness & Skills**: `.agents/`
  - `.agents/rules/`: Enforced coding, testing, security, and architectural standards for Angular, TypeScript, Node.js, and web.
  - `.agents/skills/`: On-demand skill runbooks (TDD workflow, security scanning, Angular patterns, database migrations, API design, etc.).
  - `.agents/agents/`: 68 specialized sub-agents (architect, code-reviewer, security-reviewer, tdd-guide, build-error-resolver, performance-optimizer, etc.).
  - `.agents/workflows/`: Standard engineering command workflows and recipes.

## Core Principles & Workflows

1. **Plan Before Execute**: Plan complex features and refactors before code changes. Use `ecc:planner` or `ecc:architect` workflows.
2. **Test-Driven Development**: Prefer test-first changes for bug fixes and new functionality. Verify with Angular Karma tests and backend unit/integration tests.
3. **Security-First**:
   - Parameterized queries with Sequelize / MySQL — prevent SQL injection.
   - Input validation at boundaries (express routes, controllers).
   - Sanitized HTML and safe template bindings in Angular — prevent XSS.
   - Strictly no hardcoded API keys, secrets, or tokens.
4. **Code Quality & Maintenance**:
   - Follow Angular style guide (`rules/angular-coding-style.md`).
   - Use strict TypeScript typings and proper RxJS unsubscribe lifecycle management.
   - Fail loudly with descriptive error responses instead of swallowing errors.
   - Use conventional commit conventions (`feat`, `fix`, `refactor`, `docs`, `test`, `chore`).

See [AGENTS.md](file:///d:/ADRP/udhousing-new/AGENTS.md) and [.agents/rules/](file:///d:/ADRP/udhousing-new/.agents/rules) for complete guidance.
