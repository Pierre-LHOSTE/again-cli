import { spawn } from "child_process";
import { storybookOptions } from "../../config/installOptions";
import handleProcessEvents from "../log/handleProcessEvents";
import logWithCommand from "../log/logWithCommand";
import logWithSuccess from "../log/logWithSuccess";

export default async function initStorybook() {
  const rawCommand = `pnpx sb init ${storybookOptions.join(" ")}`;
  logWithCommand("Initializing Storybook", "install", rawCommand);
  const installStorybook = spawn(rawCommand, { shell: true });
  await handleProcessEvents(installStorybook, "install");
  logWithSuccess("Storybook initialized", "install");
}
