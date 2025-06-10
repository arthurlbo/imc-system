## Getting Started

### Install dependencies:

```bash
pnpm install
```

or

```bash
yarn
```

or

```bash
npm install
```

### Copy .env
```bash
cp .env.example .env
```

### Run migrations
```bash
pnpm migrate:up
```
or

```bash
yarn migrate:up
```
or

```bash
npm run migrate:up

```
### Run seed script
```bash
pnpm run:seeds
```
or

```bash
yarn run:seeds
```
or

```bash
npm run run:seeds
```

### Run development server

```bash
pnpm dev
```

or

```bash
yarn dev
```

or

```bash
npm run dev
```

### 🔥 Your server started at http://localhost:3333

## Structure

```
└── src
    ├── commons               # Shared utilities and helper functions
    ├── constants             # Application-wide constant values
    ├── enums                 # Enum definitions for type safety
    ├── middlewares           # Custom Express middleware implementations
    ├── modules               # Feature modules
    │   ├── assessment        # Assessment logic
    │   │   ├── entity        # Database entities/models
    │   │   ├── schemas       # Validation schemas
    │   │   ├── assessment.controller.ts  # Route handlers
    │   │   ├── assessment.route.ts       # Route definitions
    │   │   ├── assessment.service.ts    # Business logic
    │   │   └── types.ts      # TypeScript type definitions
    │   ├── auth              # Authentication logic
    │   │   ├── entity        # Auth-related database entities
    │   │   ├── schemas       # Auth validation schemas
    │   │   ├── auth.controller.ts # Route handlers
    │   │   ├── auth.route.ts # Route definitions
    │   │   └── auth.service.ts # Business logic
    │   └── user             # User management logic
    │       ├── entity        # User database entities
    │       ├── schemas       # User validation schemas
    │       ├── user.controller.ts # Route handlers
    │       ├── user.route.ts # Route definitions
    │       ├── user.service.ts # Business logic
    │       └── types.ts      # User-related type definitions
    ├── app.ts               # Express application configuration
    ├── main.ts              # Application entry point (server bootstrap)
    ├── routes.ts            # Main route aggregator
    └── typeorm             # Database configuration
        ├── migrations      # Database migration files
        ├── seeds           # Data seed files
        └── data-source.ts  # TypeORM data source configuration

```

## 💻 Web

[Imc System Web](https://github.com/arthurlbo/imc-system/tree/main/web)
