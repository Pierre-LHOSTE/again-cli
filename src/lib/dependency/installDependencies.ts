import { spawn } from "child_process";
import handleProcessEvents from "../log/handleProcessEvents";
import logWithCommand from "../log/logWithCommand";
import logWithSuccess from "../log/logWithSuccess";
import makeCommand from "../makeCommand";

export default async function installDependencies(
  dependencies: string[],
  dev: boolean = false,
  name?: string
) {
  const rawCommand = `pnpm install${dev ? " -D " : " "}${dependencies.join(
    " "
  )}`;
  logWithCommand(
    `Installing ${
      name
        ? name + " "
        : dev
        ? dependencies[0]?.startsWith("@types")
          ? "types "
          : "dev "
        : ""
    }dependencies …`,
    "install",
    rawCommand
  );
  const commandArgs = makeCommand(rawCommand);
  const command = spawn(...commandArgs);
  await handleProcessEvents(command, "install");
  logWithSuccess("Dependencies installed", "install");
}
