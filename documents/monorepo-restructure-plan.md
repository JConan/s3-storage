# Monorepo Restructure Plan using Turborepo

## Proposed Structure

```
api-services/
├── apps/
│   ├── storage/
│   └── qr-code-app/
├── packages/
│   ├── config/
│   │   ├── eslint-config/
│   │   ├── tsconfig/
│   │   └── prettier-config/
│   ├── shared/
│   └── types/
├── package.json
├── turbo.json
└── README.md
```

## Implementation Steps

1. Create root package.json:
```json
{
  "name": "api-services",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
```

2. Create turbo.json for task orchestration:
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": []
    }
  }
}
```

3. Move existing apps:
- Move `storage/` to `apps/storage/`
- Move `qr-code-app/` to `apps/qr-code-app/`

4. Create shared configurations:
- `packages/config/eslint-config/`
- `packages/config/tsconfig/`
- `packages/config/prettier-config/`

5. Update app package.json files:
- Add workspace dependencies
- Remove duplicate configurations
- Update scripts to use shared configs

6. Create shared types package:
- `packages/types/` for shared TypeScript types

7. Update CI/CD pipelines:
- Add Turborepo caching
- Update build/test/lint commands

## Benefits
- Shared configurations across projects
- Efficient task execution with caching
- Better code organization
- Simplified dependency management
- Improved developer experience