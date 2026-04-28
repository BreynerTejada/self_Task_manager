# RallyClaim Workspace Instructions

## Scope

- These instructions apply to the full workspace.
- Use Docker Compose commands for setup, local execution, and tests.
- Link to source docs instead of duplicating details:
	- [README.md](README.md)
	- [CLAUDE.md](CLAUDE.md)
	- [docs/backend.md](docs/backend.md)
	- [docs/frontend.md](docs/frontend.md)
	- [docs/bulk_import_documentation.md](docs/bulk_import_documentation.md)
	- [docs/infra.md](docs/infra.md)

## Build and Test

- Setup/start:
	- `cp env-template .env`
	- `docker compose build`
	- `docker compose up -d`
- Backend:
	- `docker compose exec django pytest`
	- `docker compose exec django pytest -k "test_name"`
	- `docker compose exec django python manage.py <command>`
	- `docker compose exec django ruff check`
	- `docker compose exec django mypy .`
- Frontend:
	- `docker compose run --rm react npm run test:ci`
	- `docker compose exec react npm run test`
	- `docker compose exec react npm run typecheck`
	- `docker compose exec react npm run lint`
	- `docker compose exec react npm run build`

## Core Frontend Architecture (Mandatory)

Los componentes deben seguir una arquitectura en varios niveles:

1. Container components
	 - Aquí vive toda la lógica de negocio.
	 - Ejecutan hooks (useEffect, useState, useQuery, etc.).
	 - Realizan requests a la API.
	 - Manejan estado y orquestación.
	 - Renderizan el View component con props.
	 - Nunca concentran JSX complejo de presentación.

2. View components
	 - Son puramente representacionales y están acoplados a su container.
	 - Reciben todo por props.
	 - No contienen lógica de negocio.
	 - No hacen API calls.
	 - No importan hooks de negocio.

3. Styled components
	 - Son representacionales y reutilizables.
	 - No están ligados a un container específico.
	 - Definen piezas de UI reutilizables con MUI + sx.

Objetivo: mantener responsabilidades claras entre componentes, facilitar testing y evitar componentes monolíticos.

## Frontend Rules (Mandatory)

1. Container never has complex UI logic; View never has business logic.
2. SX styles always in a separate `.styles.sx.ts` file.
3. Everything is strictly typed with TypeScript; define interfaces for all props and API responses.
4. Domain types/interfaces live in separate `types.ts` files, never inside component files.
5. Prefer MUI `Box`, `Stack`, `Grid2` over raw `div` elements.
6. Tests go in `.spec.tsx` and cover behavior, not styles.
7. Keep Docker Compose in mind for env vars and local config.
8. When generating a component, always output: folder structure, Container, View, `.styles.sx.ts`, and key architectural notes.
9. Never create monolithic components; split once complexity grows.
10. Reusable UI pieces belong to Styled Components; feature/page-specific UI belongs to View Components.
11. Avoid comments in code unless explicitly requested.
12. Never write inline `sx` except when the value is dynamically derived from props.

## Backend and Cross-Cutting Guardrails

- Use `display_id` as lookup field for API resources (not integer id in URLs).
- Soft delete is standard; use `all_objects` when deleted rows must be included.
- Use serializer expand pattern (`?expand=`) when nested data is needed.
- Forms must use TanStack Form + Zod.
- Never run `ruff fix` or `ruff format`.
- Signals are heavily used in domain workflows; test side effects carefully.

## Output Contract for New Frontend Components

When asked to create a component, the response should include:

1. Folder structure.
2. Container implementation.
3. View implementation.
4. Styles in `.styles.sx.ts`.
5. Short architectural notes describing data flow and responsibility boundaries.

## Docs Map

- [README.md](README.md): setup, bootstrap, seeds, roles, email templates, backup/restore.
- [CLAUDE.md](CLAUDE.md): concise architecture and command reference for backend/frontend.
- [docs/backend.md](docs/backend.md): backend patterns, models, serializers, viewsets.
- [docs/frontend.md](docs/frontend.md): frontend structure and patterns.
- [docs/bulk_import_documentation.md](docs/bulk_import_documentation.md): CSV bulk import workflow and constraints.
- [docs/infra.md](docs/infra.md): infrastructure overview.

## Working Style

- Lee profundamente el proyecto, los patrones, diseños y funciones reutilizables antes de implementar cambios grandes.
- Prioriza consistencia con patrones existentes del módulo donde trabajes.