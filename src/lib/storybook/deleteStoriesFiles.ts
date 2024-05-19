import { spawnSync } from "child_process";
import { logN } from "../log/log";
import logWithCommand from "../log/logWithCommand";
import makeCommand from "../makeCommand";

const TYPE = "storybook";

export default async function deleteStoriesFiles() {
  const rawCommand = `rm -rf ./src/stories`;
  logWithCommand("Deleting stories files", "update", rawCommand, true);
  const commandArgs = makeCommand(rawCommand);
  spawnSync(...commandArgs);
  logN("Stories files deleted ✔\n", TYPE);
}
