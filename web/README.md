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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Structure

```
└── src
    ├── app
        ├── _providers    # Application context/state providers
        ├── auth          # Authentication-related pages
        ├── dashboard     # Main dashboard pages
    ├── commons           # Shared utilities/helpers
    ├── components
        ├── pages         # Page-specific components
        ├── ui            # Reusable UI components
          ├── bases       # Base/structural components (buttons, inputs, etc)
    ├── enums             # Project enum definitions
    ├── hooks             # Custom React hooks
    ├── lib               # Third-party library configurations
    ├── style             # Global styles themes
    ├── types             # Global TypeScript types and interfaces
```

## 🚀 Api

[Imc System Api](https://github.com/arthurlbo/imc-system/tree/main/server)

