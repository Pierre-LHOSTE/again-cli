import { Project, SyntaxKind } from "ts-morph";
import { logD, logN } from "../log/log";
import logWithIcon from "../log/logWithIcon";

export default function updateMainFile(project: Project) {
  logWithIcon("Updating Storybook files …", "update");
  const mainFile = project.addSourceFileAtPath("./.storybook/main.ts");
  if (!mainFile) throw new Error("main.ts file not found");
  logN("Finding main.tsx config object", "update");
  const config = mainFile.getVariableDeclaration("config");
  const configObject = config?.getInitializerIfKind(
    SyntaxKind.ObjectLiteralExpression
  );
  if (!configObject) throw new Error("Storybook config not found");
  logD();
  logN("Adding core property", "update");
  configObject.addPropertyAssignment({
    name: "core",
    initializer: `{ disableTelemetry: true }`,
  });
  logD();
  logN("Saving main.tsx file", "update");
  mainFile.saveSync();
  logD();
}
