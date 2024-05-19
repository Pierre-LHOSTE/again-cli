import { spawn } from "child_process";
import handleProcessEvents from "./log/handleProcessEvents";
import logWithCommand from "./log/logWithCommand";
import logWithSuccess from "./log/logWithSuccess";
import makeCommand from "./makeCommand";

const TYPE = "prettier";

export default async function prettier() {
  const rawCommand = `pnpx prettier --write .`;
  logWithCommand(`Running Prettier …`, TYPE, rawCommand);

  const prettierCommand = makeCommand(rawCommand);
  const command = spawn(...prettierCommand);
  await handleProcessEvents(command, TYPE);

  logWithSuccess("Prettier completed!", TYPE);
}
