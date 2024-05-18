# go-again CLI

A simple CLI tool to create _again_ a new project with some predefined structure.

The special feature of this CLI is that it doesn't clone a repository with a pre-made structure. Instead, it runs other CLIs like `create-next-app` to generate the latest versions of the necessary files, which are then dynamically modified. This ensures the project is always up to date, although it may require updates to the CLI if these underlying tools change significantly.

To run the CLI, you can use the following command:

```bash
npx go-again
```

This CLI is in development and only in French for now.

The actual STACK is:

- TypeScript
- Next.js
- Ant Design
- Prisma
- NextAuth.js
- Storybook
- ...
