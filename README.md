# Next.js Monorepo

This repo shows how to create a monorepo with yarn workspaces to use with Next.js applications

### Setup

- Create folder

```shell
mkdir next-monorepo
```

- Initialize node project with yarn

```shell
yarn init -y
```

- Indicate workspaces in the root package.json

```json
{
  "name": "next-monorepo",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "private": true,
  "workspaces": {
    "packages": ["packages/*", "apps/*"]
  }
}
```

### Create the Next.js apps

- Create the apps folder

```shell
mkdir apps
```

- Create first next app

```shell
cd apps
yarn create next-app nextapp-1
```

- Delete the apps/nextapp-1/node_modules folder and reinstall

```shell
cd apps/nextapp-1
rm -r node_modules
cd ../..
yarn install
```

This will create a new node_modules folder at the root of the monorepo, with the hoisted dependencies from the nextapp-1 workspace. The workspace's new node_modules folder will contain only some of the files it had before which were not hoisted.

- Test application locally

```shell
cd apps/nextapp-1
yarn dev
```

App should be running on localhost:3000

- Create a second app

```shell
cd apps
yarn create next-app nextapp-2
```

- Make changes to nextapp-2/app/page.tsx

```ts
import Image from "next/image";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">App 2</h1>
    </main>
  );
}
```

- Test locally

```shell
cd apps/nextapp-2
yarn dev
```

### Create shared UI components

- Create packages folder

```shell
mkdir packages
```

- Create shared UI module

```shell
cd packages
mkdir ui
cd ui
yarn init -y
```

- Edit packages/ui/package.json

```json
{
  "name": "@next-monorepo/ui",
  "version": "1.0.0",
  "main": "sharedUi.tsx",
  "license": "MIT",
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.0.4"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "eslint": "^8",
    "eslint-config-next": "14.0.4"
  }
}
```

This module needs these dependencies because we'll develop react components in it.

- Initialize tailwind in packages/ui

```shell
cd packages/ui
yarn tailwind init
```

- Create the shared component. File packages/ui/sharedUi.tsx:

```ts
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function SharedUi({ children }: Props) {
  return (
    <div className="flex flex-col">
      <div>Shared UI component!</div>
      <div>{children}</div>
    </div>
  );
}

export default SharedUi;
```

- Add UI module as dependency in apps package.json

apps/nextapp-\*/package.json:

```json
  ...
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.0.4",
    "@next-monorepo/ui": "*"
  },
  ...
```

- Import shared UI in apps

nextapp-1:

```ts
import SharedUi from "@next-monorepo/ui";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SharedUi>Hello! I am app 1</SharedUi>
    </main>
  );
}
```

nextapp-2:

```ts
import SharedUi from "@next-monorepo/ui";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SharedUi>Hello! I am app 2</SharedUi>
    </main>
  );
}
```

- Add scripts to run all projects at once at root package.json

Install npm-run-all

```shell
yarn add --dev -W npm-run-all
```

```json
  ...
  "scripts": {
    "dev-app-1": "yarn workspace nextapp-1 dev",
    "dev-app-2": "yarn workspace nextapp-2 dev",
    "dev-all": "npm-run-all --parallel dev-app-1 dev-app-2"
  },
  ...
```

<!-- - Add symbol to run dev scripts in background on apps
- Add & to dev command to run dev scripts in background on apps

apps/nextapp-*/package.json

```json
"scripts": {
    "dev": "next dev &",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
``` -->

- Run all dev servers at once

```shell
yarn dev-all
```

- Add more files to the shared utils

```shell
cd packages/ui
mkdir sharedUiComponents
cd sharedUiComponents
touch button.tsx
```

packages/ui/sharedUiComponents/button.tsx:

```ts
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function SharedButton({ children }: Props) {
  return (
    <button
      className="p-5 rounded-lg bg-gray-100"
      onClick={() => alert("This is a shared component!")}
    >
      {children}
    </button>
  );
}

export default SharedButton;
```

- Add export for button on sharedUi.tsx

```ts
import Button from "./sharedUiComponents/button";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function SharedUi({ children }: Props) {
  return (
    <div className="flex flex-col">
      <div>Shared UI component!</div>
      <div>{children}</div>
    </div>
  );
}

export { Button };
export { SharedUi };
```

- Update import on apps and include button import

apps/nextapp-1/app/page.tsx:

```ts
import { SharedUi, Button } from "@next-monorepo/ui";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SharedUi>Hello! I am app 1</SharedUi>
      <Button>App 1 Button!</Button>
    </main>
  );
}
```

apps/nextapp-2/app/page.tsx:

```ts
import { SharedUi } from "@next-monorepo/ui";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SharedUi>Hello! I am app 2</SharedUi>
    </main>
  );
}
```

### Share Tailwind configuration

- Create tailwind-config module

```shell
cd packages
mkdir tailwind-config
yarn init -y
touch index.ts
touch tailwind-theme.ts
```

package.json:

```json
{
  "name": "@next-monorepo/tailwind-config",
  "version": "1.0.0",
  "main": "index.ts",
  "license": "MIT"
}
```

index.ts:

```ts
export { theme } from "./tailwind-theme";
```

tailwind-theme.ts:

```ts
import type { Config } from "tailwindcss";

export const theme: Config["theme"] = {
  extend: {
    colors: { myGreen: "#b3e6c3" },
  },
};
```

- Install module on project

```shell
yarn install
```

- Update tailwind configuration in apps and use shared theme

nextapp-1/app/page.tsx:

```tsx
import { SharedUi, Button } from "@next-monorepo/ui";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-myGreen">
      <SharedUi>Hello! I am app 1</SharedUi>
      <Button>App 1 Button!</Button>
    </main>
  );
}
```

nextapp-1/package.json:

```json
  ...
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.0.4",
    "@next-monorepo/ui": "*",
    "@next-monorepo/tailwind-config": "*"
  },
  ...
```

nextapp-1/tailwind.config.ts:

```ts
import type { Config } from "tailwindcss";
import { theme } from "@next-monorepo/tailwind-config";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { ...theme },
  plugins: [],
};
export default config;
```

nextapp-2/tailwind.config.ts and nextapp-2/package.json: same changes as in nextapp-1

nextapp-2/app/page.tsx:

```tsx
import { SharedUi } from "@next-monorepo/ui";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SharedUi>
        <p className="bg-myGreen p-5 rounded-md">
          Hello! I am app 2 and now I use the shared theme!
        </p>
      </SharedUi>
    </main>
  );
}
```

- Update shared UI module's tailwind config to use the shared theme aswell

packages/ui/package.json:

```json
  ...
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.0.4",
    "@next-monorepo/tailwind-config": "*"
  },
  ...
```

packages/ui/tailwind.config.ts:

```js
import type { Config } from "tailwindcss";
import { theme } from "@next-monorepo/tailwind-config";

const config: Config = {
  content: [],
  theme: { ...theme },
  plugins: [],
};
export default config;
```

packages/ui/sharedUi.tsx:

```tsx
import Button from "./sharedUiComponents/button";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function SharedUi({ children }: Props) {
  return (
    <div className="flex flex-col">
      <div className="text-3xl text-myGreen bg-gray-100 p-2 rounded-md">
        Shared UI component!
      </div>
      <div>{children}</div>
    </div>
  );
}

export { Button };
export { SharedUi };
```
