import { Project, SyntaxKind } from "ts-morph";
import { logD, logN } from "../log/log";

const TYPE = "update";

export default function updatePreviewFile(project: Project, isAntd?: boolean) {
  try {
    logN("Finding preview.tsx file …", TYPE);
    const previewFile = project.addSourceFileAtPath("./.storybook/preview.tsx");
    if (!previewFile) throw new Error("preview.tsx file not found");
    logD();
    logN("Finding config object …", TYPE);
    const importStatements = previewFile.getImportDeclarations();
    const lastImport =
      importStatements[importStatements.length - 1]?.getChildIndex();
    if (typeof lastImport !== "number")
      throw new Error("Import statements not found");
    logD();
    logN("Adding import statements …", TYPE);
    previewFile.insertStatements(lastImport + 1, [
      "",
      isAntd ? `import { ConfigProvider } from "antd";` : "",
      `import React from "react";`,
      isAntd ? `import darkTheme from "../src/styles/themes/dark";` : "",
      isAntd ? `import lightTheme from "../src/styles/themes/light";` : "",
      "",
      `const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;`,
    ]);
    logD();
    logN("Finding preview object …", TYPE);
    const config = previewFile.getVariableDeclaration("preview");
    const configObject = config?.getInitializerIfKind(
      SyntaxKind.ObjectLiteralExpression
    );
    if (!configObject) throw new Error("Storybook preview not found");
    logD();
    logN("Finding parameters property …", TYPE);
    const parameters = configObject.getProperty("parameters");
    const parametersObject = parameters?.getChildrenOfKind(
      SyntaxKind.ObjectLiteralExpression
    )[0];
    if (!parametersObject) throw new Error("Parameters object not found");
    logD();
    logN("Adding backgrounds property …", TYPE);
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
    logD();
    logN("Adding decorators property …", TYPE);
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
    logD();
    logN("Saving preview.tsx file", TYPE);
    previewFile.saveSync();
    logD();
  } catch (error) {
    console.error("Error updating preview.ts file", error);
  }
}
