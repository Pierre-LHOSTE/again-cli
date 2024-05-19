import { spawn } from "child_process";
import { createNextAppOptions } from "../../config/installOptions";
import handleProcessEvents from "../log/handleProcessEvents";
import logWithCommand from "../log/logWithCommand";
import logWithSuccess from "../log/logWithSuccess";
import makeCommand from "../makeCommand";

export default async function createNextApp(projectPath: string) {
  const rawCommand = `pnpx create-next-app@latest ${projectPath} ${createNextAppOptions.join(
    " "
  )}`;
  logWithCommand("Running create-next-app …", "next", rawCommand);
  const commandArgs = makeCommand(rawCommand);
  const command = spawn(...commandArgs);
  await handleProcessEvents(command, "next");
  logWithSuccess("Command create-next-app completed!", "next");
}
