#!/usr/bin/env node
import c from "chalk";
import { Command } from "commander";
import { Project } from "ts-morph";
import addAntFile from "./lib/antd/addAntFile";
import updateLayout from "./lib/antd/updateLayout";
import getDependencies from "./lib/dependency/getDependencies";
import getDependenciesListsObject from "./lib/dependency/getDependenciesListsObject";
import installDependencies from "./lib/dependency/installDependencies";
import { logN } from "./lib/log/log";
import logWithIcon from "./lib/log/logWithIcon";
import logWithSuccess from "./lib/log/logWithSuccess";
import createNextApp from "./lib/next/createNextApp";
import removeStyleFiles from "./lib/next/removeStyleFiles";
import removeStyleImports from "./lib/next/removeStyleImports";
import updateLayoutMetadata from "./lib/next/updateLayoutMetadata";
import updatePageReturn from "./lib/next/updatePageReturn";
import prettier from "./lib/prettier";
import initPrisma from "./lib/prisma/initPrisma";
import getProjectPath from "./lib/projectPath";
import renameFile from "./lib/renameFile";
import deleteStoriesFiles from "./lib/storybook/deleteStoriesFiles";
import initStorybook from "./lib/storybook/initStorybook";
import updateMainFile from "./lib/storybook/updateMainFile";
import updatePreviewFile from "./lib/storybook/updatePreviewFile";
import updateGitignore from "./lib/updateGitignore";

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

  console.log("");

  // SECTION: Create Next App

  await createNextApp(projectPath);

  process.chdir(projectPath);

  const project = new Project({
    tsConfigFilePath: "./tsconfig.json",
  });

  await removeStyleFiles();

  logWithIcon("Deleting all CSS import …", "delete");
  const layoutFile = project.addSourceFileAtPath("./src/app/layout.tsx");
  if (!layoutFile) throw new Error("layout.tsx file not found");
  const pageFile = project.addSourceFileAtPath("./src/app/page.tsx");
  if (!pageFile) throw new Error("page.tsx file not found");
  removeStyleImports(layoutFile);
  removeStyleImports(pageFile);
  logWithSuccess("CSS importations removed", "delete");

  logWithIcon("Update layout.tsx & page.tsx …", "update");

  updateLayoutMetadata(layoutFile, projectPath);

  updatePageReturn(pageFile);
  logWithSuccess("Page & layout updated", "update");

  // !SECTION
  // SECTION: Install dependencies

  const { devDependencies, normalDependencies, typesDependencies } =
    getDependenciesListsObject(dependencies);

  if (normalDependencies.length > 0)
    await installDependencies(normalDependencies);

  if (devDependencies.length > 0)
    await installDependencies(devDependencies, true);

  if (typesDependencies.length > 0)
    await installDependencies(typesDependencies, true);

  //!SECTION
  // SECTION: Install storybook

  if (dependencies.includes("storybook")) {
    const isAntd = dependencies.includes("antd");

    await initStorybook();

    await installDependencies(
      [
        "storybook",
        "@storybook/addon-essentials",
        "@storybook/theming",
        "@storybook/addon-interactions",
        "@storybook/nextjs",
        "@storybook/react",
        "@storybook/test",
      ],
      true,
      "storybook"
    );

    updateMainFile(project);

    await renameFile(
      "./.storybook/preview.ts",
      "./.storybook/preview.tsx",
      true,
      "storybook"
    );

    updatePreviewFile(project, isAntd);

    await deleteStoriesFiles();

    logWithSuccess("Storybook files updated", "update");
  }

  // !SECTION
  // SECTION: Init prisma

  if (dependencies.includes("prisma")) {
    await initPrisma();
  }

  // !SECTION
  // SECTION: Add AntDesign

  if (dependencies.includes("antd")) {
    await installDependencies(["@ant-design/cssinjs"], false, "AntDesign");

    await addAntFile();

    updateLayout(project);

    // !SECTION
  }

  /*













  */

  // SECTION: Update .gitignore

  updateGitignore(project);

  //!SECTION
  // SECTION: Apply prettier

  await prettier();

  //!SECTION
  // SECTION: Final message

  logN(
    c.yellowBright("󰣙") + " " + c.white("Project setup completed!"),
    "again"
  );
  process.stdout.write("\n");

  process.exit(0);
  //!SECTION
})();
