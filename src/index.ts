#!/usr/bin/env node
import c from "chalk";
import { spawn } from "child_process";
import { Command } from "commander";
import prompts from "prompts";
import { Project, PropertyAssignment, SourceFile, SyntaxKind } from "ts-morph";
import {
  DependencyType,
  dependencies as allDependencies,
} from "./dependencies";
import {
  AntConfigURL,
  AntRegistryURL,
  darkThemeURL,
  lightThemeURL,
} from "./filesUrl";
import { gitignore } from "./gitignore";
import { createNextAppOptions, storybookOptions } from "./installOptions";
import {
  dependenciesQuestion,
  nameQuestion,
  newDirQuestion,
} from "./questions";

const BB = "┃";

const SPECIAL_DEPS = ["storybook"];

let projectPath: string = "";

const program = new Command();

program
  .version("0.1.0")
  .arguments("[project-directory]")
  .usage(`${c.green("<project-directory>")}`)
  .action((name) => {
    projectPath = name;
  })
  .allowUnknownOption();

program.parse(process.argv);

(async () => {
  if (typeof projectPath === "string") {
    projectPath = projectPath.trim();
  }

  if (!projectPath) projectPath = await getProjectPath();

  const dependencies = await getDependencies();

  process.env.FORCE_COLOR = "1";

  // SECTION: Create Next App

  const createNextAppCommandRaw = `pnpx create-next-app@latest ${projectPath} ${createNextAppOptions.join(
    " "
  )}`;
  const createNextAppCommand = makeCommand(createNextAppCommandRaw);
  const createNextAppRun = spawn(...createNextAppCommand);
  await handleProcessEvents(
    createNextAppRun,
    "npm",
    "create-next-app",
    createNextAppCommandRaw
  );

  process.chdir(projectPath);

  const project = new Project({
    tsConfigFilePath: "./tsconfig.json",
  });

  // SECTION: Remove styles files

  const removeStyleFilesCommandRaw = `find ./src/app -type f -name "*.css" -delete`;
  const removeStyleFilesCommand = makeCommand(removeStyleFilesCommandRaw);
  const removeStyleFilesRun = spawn(...removeStyleFilesCommand, {
    shell: true,
  });
  await handleProcessEvents(
    removeStyleFilesRun,
    "npm",
    "Remove css files",
    removeStyleFilesCommandRaw
  );

  customLog("Deleting CSS import …", c.red, "󰓾");
  const layoutFile = project.addSourceFileAtPath("./src/app/layout.tsx");
  if (!layoutFile) throw new Error("layout.tsx file not found");
  customLog("layout.tsx file found", c.red);
  const importLayoutDeclarations = layoutFile.getImportDeclarations();
  importLayoutDeclarations.forEach((importDeclaration) => {
    const moduleSpecifier = importDeclaration.getModuleSpecifierValue();
    if (moduleSpecifier.endsWith(".css")) {
      importDeclaration.replaceWithText("");
    }
  });
  customLog("page.tsx CSS importation removed", c.red);
  layoutFile.saveSync();
  const pageFile = project.addSourceFileAtPath("./src/app/page.tsx");
  if (!pageFile) throw new Error("page.tsx file not found");
  customLog("page.tsx file found", c.red);
  const importPageDeclarations = pageFile.getImportDeclarations();
  importPageDeclarations.forEach((importDeclaration) => {
    const moduleSpecifier = importDeclaration.getModuleSpecifierValue();
    if (moduleSpecifier.endsWith(".css")) {
      importDeclaration.replaceWithText("");
    }
  });
  customLog("page.tsx CSS importation removed", c.red);
  pageFile.saveSync();
  customLog("CSS importations removed", c.red, "success");

  //!SECTION
  // SECTION: Update layout meta

  customLog("Updating layout meta …", c.redBright, "update");
  const metadata = layoutFile.getVariableDeclarationOrThrow("metadata");
  const metadataObject = metadata.getInitializerIfKind(
    SyntaxKind.ObjectLiteralExpression
  );
  if (!metadataObject) throw new Error("Metadata object not found");
  customLog("Metadata object found", c.redBright);
  const titleProperty = metadataObject.getProperty(
    "title"
  ) as PropertyAssignment;
  if (!titleProperty) throw new Error("Title property not found");
  customLog("Title property found", c.redBright);
  const projectTitle = projectPath.split("/").pop();
  titleProperty.setInitializer(`"${projectTitle}"`);
  const descriptionProperty = metadataObject.getProperty(
    "description"
  ) as PropertyAssignment;
  if (!descriptionProperty) throw new Error("Description property not found");
  customLog("Description property found", c.redBright);
  descriptionProperty.setInitializer(
    `"Temporary ${projectTitle} project description by create-next-app and again-cli"`
  );

  customLog("Title updated", c.redBright);

  layoutFile.insertText(
    metadataObject.getStart(),
    "Update metadata".replace(/(.*)/, "TODO: $1").replace(/(.*)/, "// $1\n")
  );
  customLog("TODO added", c.redBright);

  layoutFile.saveSync();

  // !SECTION
  // SECTION: Update page return

  customLog("Updating page return …", c.redBright, "update");
  const homeFunction = pageFile
    .getFunctions()
    .find((func) => func.isDefaultExport() && func.getName() === "Home");
  if (!homeFunction) throw new Error("Home function not found");
  customLog("Home function found", c.redBright);
  homeFunction.setBodyText(`return (<>Home</>);`);
  pageFile.saveSync();
  project.removeSourceFile(pageFile);
  customLog("Page return updated", c.redBright, "success");

  // !SECTION

  //!SECTION
  // SECTION: Install dependencies

  const { devDependencies, normalDependencies, typesDependencies } =
    getDependenciesLists(dependencies);

  if (normalDependencies.length > 0) {
    const installNormalDependencyCommandRaw = `pnpm i ${normalDependencies
      .map((dep) => dep.value)
      .join(" ")}`;
    const installNormalDependencyCommand = makeCommand(
      installNormalDependencyCommandRaw
    );
    const installNormalDependencyRun = spawn(...installNormalDependencyCommand);
    await handleProcessEvents(
      installNormalDependencyRun,
      "install",
      "Dependencies",
      installNormalDependencyCommandRaw
    );
  }

  if (devDependencies.length > 0) {
    const installDevDependencyCommandRaw = `pnpm i -D ${devDependencies
      .map((dep) => dep.value)
      .join(" ")}`;
    const installDevDependencyCommand = makeCommand(
      installDevDependencyCommandRaw
    );
    const installDevDependencyRun = spawn(...installDevDependencyCommand);
    await handleProcessEvents(
      installDevDependencyRun,
      "install",
      "Dev dependencies",
      installDevDependencyCommandRaw
    );
  }

  if (typesDependencies.length > 0) {
    const installTypesDependencyCommandRaw = `pnpm i -D ${typesDependencies.join(
      " "
    )}`;
    const installTypesDependencyCommand = makeCommand(
      installTypesDependencyCommandRaw
    );
    const installTypesDependencyRun = spawn(...installTypesDependencyCommand);
    await handleProcessEvents(
      installTypesDependencyRun,
      "install",
      "Types dependencies",
      installTypesDependencyCommandRaw
    );
  }

  //!SECTION

  if (dependencies.includes("storybook")) {
    // SECTION: Install storybook

    const initStorybookCommandRaw = `pnpx sb init ${storybookOptions.join(
      " "
    )}`;
    const installStorybook = spawn(initStorybookCommandRaw, { shell: true });
    await handleProcessEvents(
      installStorybook,
      "npm",
      "Storybook",
      initStorybookCommandRaw
    );

    const installStorybookDepCommandRaw = `pnpm i -D storybook @storybook/addon-essentials @storybook/theming @storybook/addon-interactions @storybook/nextjs @storybook/react @storybook/test`;
    const installStorybookDeps = spawn(installStorybookDepCommandRaw, {
      shell: true,
    });
    await handleProcessEvents(
      installStorybookDeps,
      "install",
      "Storybook dependencies",
      installStorybookDepCommandRaw
    );

    // SECTION: Update storybook config

    const isAntd = dependencies.includes("antd");

    customLog("Updating Storybook config …", c.magenta, "update");

    const mainFile = project.addSourceFileAtPath("./.storybook/main.ts");
    if (!mainFile) throw new Error("main.ts file not found");
    customLog("main.ts file found", c.magenta);
    updateSbMainFile(mainFile);
    customLog("Storybook config updated", c.magenta, "success");

    // !SECTION
    // SECTION:  Update storybook preview

    // Rename

    const renameCommandRaw = `mv ./.storybook/preview.ts ./.storybook/preview.tsx`;
    const renameCommand = makeCommand(renameCommandRaw);
    const renamePreview = spawn(...renameCommand);
    await handleProcessEvents(
      renamePreview,
      "rename",
      "preview.tsx",
      renameCommandRaw
    );

    // Update file

    customLog("Updating Storybook preview …", c.magenta, "update");
    const previewFile = project.addSourceFileAtPath("./.storybook/preview.tsx");
    if (!previewFile) throw new Error("preview.tsx file not found");
    updatePreviewFile(previewFile, isAntd);

    customLog("Storybook preview updated", c.magenta, "success");

    // !SECTION
    // SECTION: Delete stories folder

    const deleteStoriesFolderCommandRaw = `rm -rf ./src/stories`;
    const deleteStoriesFolderCommand = makeCommand(
      deleteStoriesFolderCommandRaw
    );
    const deleteStoriesFolder = spawn(...deleteStoriesFolderCommand);
    await handleProcessEvents(
      deleteStoriesFolder,
      "npm",
      "Delete stories folder",
      deleteStoriesFolderCommandRaw
    );

    // !SECTION

    //!SECTION
  }

  if (dependencies.includes("prisma")) {
    // SECTION: Init prisma

    const initPrismaCommandRaw = `npx prisma init`;
    const initPrismaCommand = makeCommand(initPrismaCommandRaw);
    const initPrisma = spawn(...initPrismaCommand);
    await handleProcessEvents(
      initPrisma,
      "npm",
      "Prisma",
      initPrismaCommandRaw
    );

    //!SECTION
  }

  // SECTION: Add antd config

  if (dependencies.includes("antd")) {
    const addAntRegistryDepCommandRaw = `pnpm i @ant-design/cssinjs`;
    const addAntRegistryDepCommand = makeCommand(addAntRegistryDepCommandRaw);
    const addAntRegistryDep = spawn(...addAntRegistryDepCommand);
    await handleProcessEvents(
      addAntRegistryDep,
      "install",
      "AntRegistry dependencies",
      addAntRegistryDepCommandRaw
    );

    const addAntRegistryCommandRaw = `curl --no-progress-meter -o "./src/app/AntRegistry.tsx" "${AntRegistryURL}"`;
    const addAntRegistryCommand = spawn(addAntRegistryCommandRaw, {
      shell: true,
    });
    await handleProcessEvents(
      addAntRegistryCommand,
      "curl",
      "antRegistry.tsx",
      addAntRegistryCommandRaw
    );

    const addThemeDirCommandRaw = `mkdir -p ./src/styles/themes`;
    const addThemeDirCommand = spawn(addThemeDirCommandRaw, { shell: true });
    await handleProcessEvents(
      addThemeDirCommand,
      "mkdir",
      "Themes directory",
      addThemeDirCommandRaw
    );

    const addAntConfigCommandRaw = `curl --no-progress-meter -o "./src/app/AntConfig.tsx" "${AntConfigURL}"`;
    const addAntConfigCommand = spawn(addAntConfigCommandRaw, { shell: true });
    await handleProcessEvents(
      addAntConfigCommand,
      "curl",
      "antConfig.tsx",
      addAntConfigCommandRaw
    );

    const addAntDarkTheme = `curl --no-progress-meter -o "./src/styles/themes/dark.tsx" "${darkThemeURL}"`;
    const addAntDarkThemeCommand = spawn(addAntDarkTheme, { shell: true });
    await handleProcessEvents(
      addAntDarkThemeCommand,
      "curl",
      "Dark Theme",
      addAntDarkTheme
    );

    const addAntLightTheme = `curl --no-progress-meter -o "./src/styles/themes/light.tsx" "${lightThemeURL}"`;
    const addAntLightThemeCommand = spawn(addAntLightTheme, { shell: true });
    await handleProcessEvents(
      addAntLightThemeCommand,
      "curl",
      "Light Theme",
      addAntLightTheme
    );

    customLog("Updating layout file …", c.redBright, "update");
    const layoutFile = project.addSourceFileAtPath("./src/app/layout.tsx");
    layoutFile.addImportDeclarations([
      {
        defaultImport: "AntConfig",
        moduleSpecifier: "./AntConfig",
      },
      {
        defaultImport: "AntRegistry",
        moduleSpecifier: "./AntRegistry",
      },
    ]);
    customLog("Imports added", c.redBright);

    const rootLayoutFunction = layoutFile.getFunctionOrThrow("RootLayout");

    rootLayoutFunction.setBodyText(`
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntRegistry>
          <AntConfig>
            {children}
          </AntConfig>
        </AntRegistry>
      </body>
    </html>
  );
    `);
    customLog("return updated", c.redBright);

    layoutFile.saveSync();
    customLog("File layout updated", c.redBright, "success");

    // !SECTION
  }

  /*













  */

  // SECTION: Update .gitignore

  customLog("Updating .gitignore file …", c.redBright, "");
  try {
    const sourceFile = project.addSourceFileAtPath("./.gitignore");
    customLog(".gitignore file found", c.redBright);
    sourceFile.addStatements(
      gitignore.map((category) => {
        return `\n# ${category.category}\n${category.value
          .map((value) => `${value}\n`)
          .join("")}`;
      })
    );
    customLog("Ignored files added", c.redBright);
    sourceFile.saveSync();
  } catch (error) {
    console.error("Error updating .gitignore file", error);
  }
  customLog(".gitignore file updated", c.redBright, "success");

  //!SECTION
  // SECTION: Apply prettier

  const prettierCommandRaw = `pnpx prettier --write .`;
  const prettierCommand = makeCommand(prettierCommandRaw);
  const prettier = spawn(...prettierCommand);
  await handleProcessEvents(prettier, "npm", "Prettier", prettierCommandRaw);

  //!SECTION
  // SECTION: Final message

  processLog(
    "\n" + c.yellowBright("󰣙") + " " + c.white("Project setup completed!"),
    c.yellow
  );
  process.stdout.write("\n");

  process.exit(0);
  //!SECTION
})();

async function getProjectPath() {
  let projectPath: string = "";
  const { dir } = await prompts(newDirQuestion);
  if (typeof dir !== "boolean") process.exit();
  if (dir) {
    const { name } = await prompts(nameQuestion);
    if (!name) process.exit();
    projectPath = name.trim();
    if (!projectPath) process.exit();
    if (dir) {
      projectPath = `./${projectPath}`;
    }
  } else {
    projectPath = ".";
  }
  if (typeof projectPath !== "string") {
    process.exit();
  }
  return projectPath;
}

async function getDependencies() {
  let { dependencies } = await prompts(dependenciesQuestion);
  if (dependencies) {
    dependencies = dependencies.filter((dep: string) => dep !== "");
  } else {
    process.exit();
  }
  return dependencies;
}

function makeCommand(command: string): [string, string[]] {
  const mainCommand = command.split(" ")[0] as string;
  const args = command.split(" ").slice(1);
  return [mainCommand, args];
}

function getDependenciesLists(dependencies: DependencyType[]) {
  const dependenciesObj: DependencyType[] = Object.values(allDependencies)
    .flatMap((dependencyArray) => dependencyArray)
    .filter(
      (dep: any) =>
        dependencies.includes(dep.value) && !SPECIAL_DEPS.includes(dep.value)
    );
  const devDependencies = dependenciesObj.filter((dep) => dep.dev);
  const normalDependencies = dependenciesObj.filter((dep) => !dep.dev);
  const typesDependencies = dependenciesObj
    .filter((dep) => dep.needType)
    .map((dep) => `@types/${dep.value}`);

  return {
    devDependencies,
    normalDependencies,
    typesDependencies,
  };
}

function updateSbMainFile(mainFile: SourceFile) {
  try {
    const config = mainFile.getVariableDeclaration("config");
    const configObject = config?.getInitializerIfKind(
      SyntaxKind.ObjectLiteralExpression
    );
    if (configObject) {
      customLog("Config object found", c.magenta);
      configObject.addPropertyAssignment({
        name: "core",
        initializer: `{ disableTelemetry: true }`,
      });
      customLog("Core property added", c.magenta);
    } else {
      throw new Error("Storybook config not found");
    }
    mainFile.saveSync();
  } catch (error) {
    console.error("Error updating main.ts file", error);
  }
}

function updatePreviewFile(previewFile: SourceFile, isAntd?: boolean) {
  try {
    customLog("preview file found", c.magenta);

    const importStatements = previewFile.getImportDeclarations();
    const lastImport =
      importStatements[importStatements.length - 1]?.getChildIndex();
    if (typeof lastImport !== "number")
      throw new Error("Import statements not found");

    customLog("Import statements found", c.magenta);

    previewFile.insertStatements(lastImport + 1, [
      "",
      isAntd ? `import { ConfigProvider } from "antd";` : "",
      `import React from "react";`,
      isAntd ? `import darkTheme from "../src/styles/themes/dark";` : "",
      isAntd ? `import lightTheme from "../src/styles/themes/light";` : "",
      "",
      `const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;`,
    ]);
    customLog("Add Import statements & isDarkTheme variable", c.magenta);

    const config = previewFile.getVariableDeclaration("preview");
    const configObject = config?.getInitializerIfKind(
      SyntaxKind.ObjectLiteralExpression
    );
    if (configObject) {
      customLog("Preview object found", c.magenta);
      const parameters = configObject.getProperty("parameters");

      const parametersObject = parameters?.getChildrenOfKind(
        SyntaxKind.ObjectLiteralExpression
      )[0];

      if (!parametersObject) throw new Error("Parameters object not found");

      parametersObject.addPropertyAssignment({
        name: "backgrounds",
        initializer: `
      {
        default: isDarkTheme ? "dark" : "light",
        values: [
          { name: "light", value: "#e9e9e9" },
          { name: "dark", value: "#000" },
        ],
      },
      `,
      });

      customLog("Backgrounds property added", c.magenta);

      previewFile.saveSync();

      configObject.addPropertyAssignment({
        name: "decorators",
        initializer: isAntd
          ? `[
          (Story) => {
            const isDarkTheme = window.matchMedia(
              "(prefers-color-scheme: dark)"
            ).matches;
            return (
              <ConfigProvider theme={isDarkTheme ? darkTheme : lightTheme}>
                <Story />
              </ConfigProvider>
            );
          },
        ]`
          : `[
          (Story) => {
            return <Story />;
          },
        ]`,
      });
      customLog("Decorators property added", c.magenta);

      previewFile.saveSync();
    } else {
      throw new Error("Storybook preview not found");
    }
  } catch (error) {
    console.error("Error updating preview.ts file", error);
  }
}

function getLogConfig(name: string, type: string, rawCommand?: string) {
  const logConfig = {
    color: c.white,
    loading: "Step " + name + "…",
    success: name + " completed!",
    icon: c.white(""),
  };

  switch (type) {
    case "npm":
      logConfig.color = c.redBright;
      logConfig.loading = `Running ${name} command …`;
      logConfig.success = `Command ${name} completed!`;
      logConfig.icon = "";
      switch (name.toLowerCase()) {
        case "create-next-app":
          logConfig.color = c.white;
          logConfig.icon = "󰔶";
          break;
        case "storybook":
          logConfig.color = c.magenta;
          logConfig.loading = "Initializing Storybook …";
          logConfig.success = "Storybook initialized!";
          logConfig.icon = "";
          break;
        case "prisma":
          logConfig.color = c.cyan;
          logConfig.loading = "Initializing Prisma …";
          logConfig.success = "Prisma initialized!";
          logConfig.icon = "";
          break;
        case "prettier":
          logConfig.color = c.blue;
          logConfig.loading = "Running prettier …";
          logConfig.success = "Prettier completed!";
          logConfig.icon = "";
          break;
      }
      break;
    case "install":
      logConfig.color = c.redBright;
      logConfig.loading = `Installing ${name} …`;
      logConfig.success = `${name} installed!`;
      logConfig.icon = "󰇚";
      break;
    case "rename":
      logConfig.color = c.white;
      logConfig.loading = `Renaming ${name} …`;
      logConfig.success = `File ${name} renamed!`;
      logConfig.icon = "";
      break;
    case "curl":
      logConfig.color = c.yellow;
      logConfig.loading = `Adding ${name} …`;
      logConfig.success = `File ${name} added!`;
      logConfig.icon = "󰇚";
      break;
    case "move":
      logConfig.color = c.magenta;
      logConfig.loading = `Moving ${name} …`;
      logConfig.success = `File ${name} moved!`;
      logConfig.icon = "󰇚";
      break;
    // case "create-next-app":
    //   logConfig.color = c.white;
    //   logConfig.loading = "Running create-next-app command …";
    //   logConfig.success = "Command create-next-app completed!";
    //   logConfig.icon = "󰔶";
    //   break;
    // case "dependencies":
    // case "dev-dependencies":
    // case "types-dependencies":
    // case "storybook-dependencies":
    //   logConfig.color = c.redBright;
    //   logConfig.loading =
    //     "Installing " +
    //     name.replace(/^(\w)/, (m, p) => p.toUpperCase()).replace(/-/, " ") +
    //     " …";
    //   logConfig.success = "Dependencies installed!";
    //   logConfig.icon = "󰇚";
    //   break;
    // case "storybook":
    //   logConfig.color = c.magenta;
    //   logConfig.loading = "Initializing Storybook …";
    //   logConfig.success = "Storybook initialized!";
    //   logConfig.icon = "";
    //   break;
    // case "prisma":
    //   logConfig.color = c.cyan;
    //   logConfig.loading = "Initializing Prisma …";
    //   logConfig.success = "Prisma initialized!";
    //   logConfig.icon = "";
    //   break;
    // case "prettier":
    //   logConfig.color = c.blue;
    //   logConfig.loading = "Running prettier …";
    //   logConfig.success = "Prettier completed!";
    //   logConfig.icon = "";
    //   break;
    // case "rename-preview.tsx":
    //   logConfig.color = c.white;
    //   logConfig.loading = "Renaming preview.ts to preview.tsx …";
    //   logConfig.success = "File renamed!";
    //   logConfig.icon = "";
    //   break;
    // case "rename-globals-scss":
    //   logConfig.color = c.white;
    //   logConfig.loading = "Renaming globals.css to globals.scss …";
    //   logConfig.success = "File renamed!";
    //   logConfig.icon = "";
    //   break;

    default:
      break;
  }

  return {
    ...logConfig,
    loading:
      logConfig.color(logConfig.icon) +
      " " +
      c.white(logConfig.loading) +
      "\n" +
      c.dim("󱞩 " + rawCommand),
    success: c.greenBright("") + " " + c.white(logConfig.success),
  };
}

function processLog(message: string, color: (arg0: string) => string) {
  process.stdout.write(message.replace(/\n/g, "\n" + color(BB) + " "));
}

function customLog(
  message: string,
  color: (arg0: string) => string,
  type?: string,
  rawCommand?: string
) {
  let icon = "";
  if (type) {
    switch (type) {
      case "success":
        icon = c.greenBright("");
        break;
      case "loading":
        icon = "󰇚";
        break;
      case "update":
        icon = "";
        break;

      default:
        icon = type;
        break;
    }
    icon = icon + " ";
  }

  message = color(BB) + " " + color(icon) + (type ? c.white(message) : message);
  if (rawCommand) {
    message += "\n" + color(BB) + " " + c.dim("󱞩 " + rawCommand);
  }
  if (type && type !== "success") {
    message = "\n" + message + "\n" + color(BB);
  }
  if (type === "success") {
    message = color(BB) + "\n" + message;
  }
  // process.stdout.write(message.replace(/\n/g, "\n" + color(BB) + " "));
  console.log(message);
}

function handleProcessEvents(
  cmdProcess: any,
  type: string,
  name: string,
  rawCommand?: string
) {
  const { color, success, loading } = getLogConfig(name, type, rawCommand);
  processLog("\n" + loading + "\n\n", color);
  return new Promise<void>((resolve, reject) => {
    cmdProcess.stdout?.on("data", (data: any) => {
      processLog(data.toString(), color);
    });
    cmdProcess.stderr?.on("data", (data: any) => {
      processLog(data.toString(), color);
    });
    cmdProcess.on("error", (error: any) => {
      processLog(error.message, color);
    });
    cmdProcess.on("close", (code: any) => {
      processLog("\n" + success, color);
      process.stdout.write("\n");
      resolve();
    });
  });
}
