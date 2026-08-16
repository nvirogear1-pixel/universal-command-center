# Universal Command Center Architectural Direction

The Universal Command Center is the first deployable front-end shell and control surface. It should become the spine that visually and operationally connects separate projects, modules, agents, deployments, and customer instances.

It should not become one giant repository containing every app and module.

The Command Center itself is also a reusable shell.

Conceptually, treat it as the Universal Command Center Shell:
- visual universe shell
- project-room shell
- graph visualization shell
- command/control surface shell
- future terminal/build/live-app shell

It should be capable of being reused as the control surface for other sovereign systems without duplicating the canonical kernel.

A shell is a reusable capability with:
- its own canonical identity
- stable contract/interface
- tests
- version history
- independent lifecycle/repository when appropriate

Apps compose shells. They should not fork or privately duplicate them unless there is a deliberate exception.

## Core Architecture

Universal Command Center:
- visual universe
- project navigation
- rooms
- command surface
- status/health
- relationships
- agent visibility
- deployment visibility
- history
- future terminal/build controls

ARCA / kernel:
- canonical entity IDs
- relationship graph
- authority/capabilities
- event ledger
- provenance
- lifecycle state
- orchestration
- composition/extraction logic

Project repositories:
- actual source code
- tests
- package/module implementation
- app-specific configuration
- deployable code

The Command Center represents these projects. It does not need to physically contain all of them.

## Repository Model

Use separate repositories when the capability deserves its own lifecycle.

Examples:
- universal-command-center
- alice
- treeos
- fieldtrace
- image-shell
- auth-shell
- accounting-shell
- future reusable modules/shells

Customer-specific repositories should only exist if a customer genuinely requires an isolated implementation. Prefer shared core apps, reusable modules, and customer configuration/extensions over code forks.

## Command Center Entity Model

A project/module node may eventually resolve to:
- canonical entity ID
- entity type
- display name
- repository URL
- local workspace path
- deployment URL
- deployment provider
- active branch
- commit hash
- test status
- health
- current agent
- current task
- related modules
- dependencies
- customers using it
- parent/host context
- provenance
- history/events

The universe is a projection of this truth.

Example: FieldTrace could represent:
- repository: fieldtrace
- type: module/application
- uses: map-shell
- operational_in: treeos
- assigned_to: Worker A
- deployed_to: production
- tests: passing
- health: healthy

Tapping FieldTrace in the Command Center should eventually allow:
- Open Room
- Open Repository
- Open Terminal
- View Files
- View Logic
- View Tests
- View Agent
- Run Tests
- Deploy
- Open Live App
- View History

## Boundary

Do not turn universal-command-center into a monorepo for every existing project unless there is a specific architectural reason later.

The intended pattern is:
- Command Center discovers and represents projects.
- ARCA/kernel understands and governs relationships/state.
- Repositories contain actual implementation.

GitHub is the version-control and code-history layer. It provides source history, commits, branches, rollback, collaboration, and Cloudflare deployment source. GitHub is not the canonical ARCA memory or authority layer.

## Deployment Flow

Preferred project lifecycle:

Local development -> Git commit -> GitHub -> Cloudflare deployment -> Command Center reflects deployment state

For the Universal Command Center itself:

universal-command-center -> GitHub -> Cloudflare Pages -> public/live Command Center

Future projects can follow the same pattern.

## Universe Concept

The Command Center may render the same canonical graph in multiple visual metaphors:
- Cosmos
- Forest
- Gears
- Rocks
- Minimal
- custom owner-created universes

The visual representation may evolve freely. Canonical truth must not.

One canonical reality, unlimited evolving projections.

## Entity Lifecycle

Support this conceptual lifecycle:

IDEA -> DISCOVERY -> BUILD -> EXTRACTION -> COMPOSITION -> RECOMPOSITION

An idea may begin as a star. As it becomes real, it may become a project/app/world. Reusable capability may later be extracted into its own module/shell. Other projects can then use that shell without copying it.

## Composition Model

Important relationships:
- uses
- derived_from
- part_of
- instance_of
- assigned_to
- operational_in
- managed_by
- tracked_by
- deployed_to

`part_of` must never destroy canonical identity.

A project can visually exist inside another system while keeping its own entity ID, history, and relationships.

## Shell Economy

As projects are built, reusable capabilities should become standalone shells/modules.

Examples:
- Map Shell
- Image Shell
- Identity/Auth Shell
- Payment Shell
- Accounting Shell
- Memory Shell
- Voice Shell
- Deployment Shell
- File/Logic Tree
- Audit Ledger

Eventually ARCA should traverse the graph and answer:

"You already have most of the pieces to build this."

Example: LandscapeOS:
- Identity Shell: available
- Map Shell: available
- Image Shell: available
- Payment Shell: available
- FieldTrace: available
- Scheduling: new work

Reusable architecture: approximately 83%.

This analysis must come from real canonical entities and relationships, not invented UI state.

## Customers / Tenants

Apps such as TreeOS may have customer entities beneath them:
- Dale's Tree Service
- Abel Tree Service
- Brushman Tree Service
- future customers

Each customer should have:
- its own canonical identity
- private data boundary
- permissions
- configuration
- history
- customer-specific extensions

Avoid forking the entire app for every customer.

Preferred evolution:

Customer request -> Customer extension -> Overlap detected -> Shared shell extracted -> Multiple customers use shell -> Core capability

## Color / Visual Identity

Major systems should eventually have visual color families.

Example: Alice may have one base color family. Modules derived from Alice retain an Alice-origin visual marker even when used inside another app.

Suggested conceptual rule:
- core hue = origin/provenance
- outer ring/context marker = current host/app/customer
- status effect = health/runtime condition

Do not use identity color as failure color. Red should remain reserved for real failure/danger.

## Alice

Alice is likely to become a backend/intelligence system used by many other applications.

Her ingestion and analysis layers may become reusable modules, such as:
- parcel ingestion
- hydrology
- elevation
- zoning
- environmental data
- imagery
- scoring
- location intelligence

Other apps should be able to use only the Alice modules they need.

Do not duplicate those modules per app.
