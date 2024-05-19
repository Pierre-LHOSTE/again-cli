export const createNextAppOptions = [
  "--typescript",
  "--no-tailwind",
  "--eslint",
  "--src-dir",
  "--app",
  "--no-import-alias",
  "--use-pnpm",
];

export const storybookOptions = [
  "--package-manager pnpm",
  "--disable-telemetry",
  "--builder vite",
  "--parser tsx",
  "--type nextjs",
  "--debug",
  "--skip-install",
];
