# Architecture

## Monorepo Structure

The project is organized as a monorepo with separate applications for API, bot, and dashboard.  
Each application has a clear responsibility and communicates through well-defined boundaries.

---

## apps/api

### Purpose
`apps/api` is the main backend application.  
It is responsible for business logic, authentication, database access orchestration, validation, and exposing HTTP APIs for the dashboard and other clients.

### Responsibilities
- Handle authentication and authorization
- Expose REST-style API endpoints
- Validate request input
- Coordinate business use cases
- Manage registration flow
- Create default business/workspace after owner registration
- Manage employee and manager invite creation
- Resolve onboarding links and invite states
- Connect users to businesses through memberships
- Enforce access control by workspace and role

### Suggested Layering
`apps/api` should follow a layered structure:

- **routes/**  
  Defines HTTP endpoints and request/response handling
- **controllers/** or route handlers  
  Maps incoming requests to application services
- **services/**  
  Contains business use cases and orchestration logic
- **repositories/**  
  Handles database interaction
- **validators/**  
  Contains request validation schemas
- **middlewares/**  
  Handles auth, role checks, error formatting, logging
- **modules/**  
  Groups domain-specific features such as auth, business, workspace, invites, members

### Core Domains
Main feature modules inside `apps/api` should include:

- **auth**
  - register with form
  - login
  - Google auth
- **business**
  - create default business for new owner
  - read and manage business info
- **workspace**
  - list businesses available to current user
  - switch selected workspace context
- **invites**
  - create invite
  - generate token
  - hash token before persistence
  - set expiration
  - mark invite as used / expired / cancelled
- **memberships**
  - connect users to businesses
  - assign role: OWNER, MANAGER, EMPLOYEE

### Ownership Rules
- A newly registered business owner automatically gets an `OWNER` membership in the default business.
- Invite creation must always happen in the context of a selected business.
- Role assignment for invited users must come from the invite, not from user input.

### API Notes
`apps/api` should act as the single source of truth for:
- invite lifecycle
- business membership rules
- workspace access
- onboarding completion rules

The dashboard and bot should not duplicate this logic.

---

## apps/bot

### Purpose
`apps/bot` is the Telegram integration layer.  
It is responsible for handling Telegram bot interactions and connecting invite links to the onboarding flow.

### Responsibilities
- Receive `/start` commands from Telegram users
- Parse invite tokens from bot deep links
- Resolve invite state through backend services or API
- Store Telegram user identity related to the invite
- Keep lightweight conversational state if needed
- Send the onboarding link to the invited employee or manager
- Provide future support for business notifications, reminders, and automation flows

### Scope
The bot should remain thin.  
It should not contain heavy business logic or direct domain decisions that belong in `apps/api`.

### Recommended Behavior
When a user opens an invite link and presses `/start`:

1. Read the invite token from the Telegram start parameter
2. Send the token to the backend for validation
3. Backend verifies:
   - invite exists
   - invite is not used
   - invite is not cancelled
   - invite is not expired
4. If valid:
   - associate Telegram user ID with the invite session
   - keep track of which business the invite belongs to
   - send onboarding link to the user
5. If invalid:
   - send an appropriate error message

### Suggested Internal Structure
- **handlers/**
  - command handlers
  - message handlers
- **services/**
  - bot-to-api integration
  - invite resolution flow
- **utils/**
  - Telegram message formatting
  - deep-link parsing
- **modules/**
  - invite-start
  - onboarding-link sender
  - notifications

### Bot Design Rule
`apps/bot` should be an interaction channel, not the system of record.  
Any persistent business decision should go through `apps/api`.

---

## apps/dashboard

### Purpose
`apps/dashboard` is the main web interface for business owners and team members.  
It is responsible for workspace selection, business management, and invite management UI.

### Responsibilities
- Owner registration and login UI
- Google auth entry point
- Workspace listing and selection
- Business page and settings page
- Employee and manager invite creation UI
- Invite status visibility
- Member management UI
- Role-based interface rendering

### Main Screens
The dashboard should include at least:

- **Auth صفحات / pages**
  - register
  - login
  - Google auth callback handling
- **Workspace section**
  - list of businesses available to the user
  - selected workspace switcher
- **Business page**
  - selected business details
  - members tab
  - invite actions
- **Invite modal**
  - role dropdown:
    - MANAGER
    - EMPLOYEE
  - create invite action
  - copy invite link action
  - share via Telegram action

### Invite UX
The invite modal should:
- always operate in the currently selected business context
- create an invite through the API
- receive the generated deep link
- provide:
  - copy link
  - share via Telegram

The user should not manually type the business or role outside the controlled form.

### Suggested Frontend Structure
- **pages/** or **routes/**
  - auth
  - workspace
  - business
- **components/**
  - workspace switcher
  - invite modal
  - members table
- **features/**
  - auth
  - workspace
  - invites
  - members
- **services/**
  - API client functions
- **stores/** or **state/**
  - session state
  - selected workspace state
- **guards/**
  - authenticated route guard
  - role-based rendering guard

### Dashboard Rules
- Selected workspace must drive all business-scoped actions
- Invite creation must be disabled when there is no selected workspace
- Invite statuses should be visible in the UI:
  - pending
  - used
  - expired
  - cancelled
- Business owners should be able to invite managers and employees
- Managers may have limited permissions depending on product rules

---

## Cross-App Communication

### apps/dashboard -> apps/api
The dashboard communicates with the API for:
- auth
- workspace data
- business data
- invite creation
- member listing
- onboarding-related reads

### apps/bot -> apps/api
The bot communicates with the API for:
- invite token validation
- Telegram user binding
- onboarding link resolution
- invite state checks

### apps/api -> database
The API is the main boundary for persistence and domain consistency.

---

## Core Architectural Principles

### 1. Single Source of Truth
All domain rules must live in `apps/api`.  
Neither `apps/bot` nor `apps/dashboard` should duplicate invite lifecycle logic.

### 2. Thin Clients
Both dashboard and bot should stay focused on interaction and presentation.

### 3. Workspace-Scoped Actions
Any business-related action must happen inside a selected workspace/business context.

### 4. Role-Driven Access
Permissions must be determined by business membership role, not by free-form client input.

### 5. Invite Lifecycle Control
Invite creation, validation, usage, cancellation, and expiration must be consistent across all apps.

---

## Recommended Domain Flow

### Owner Registration
1. Business owner registers through form or Google Auth
2. API creates the user
3. API automatically creates a default business/workspace
4. API creates an `OWNER` membership
5. Dashboard redirects the user into workspace flow

### Employee Invite
1. Owner selects a workspace
2. Owner opens invite modal on the business page
3. Owner chooses `MANAGER` or `EMPLOYEE`
4. API creates invite token and persists hashed token
5. Dashboard shows invite link with copy/share actions

### Invite Acceptance
1. Invited user opens Telegram invite link
2. Bot receives `/start` with token
3. Bot sends token to API for validation
4. If valid, bot stores Telegram identity context and sends onboarding form link
5. User opens form and submits name and password
6. API creates or resolves the user account
7. API creates business membership with the invited role
8. API marks invite as `USED`

---