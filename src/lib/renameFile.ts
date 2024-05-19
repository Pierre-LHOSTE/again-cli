import { spawn } from "child_process";
import { LogType } from "./log/log.d";
import logWithCommand from "./log/logWithCommand";
import makeCommand from "./makeCommand";

const TYPE = "rename";

export default async function renameFile(
  from: string,
  to: string,
  noIcon?: boolean,
  type?: LogType
) {
  return new Promise<void>((resolve, reject) => {
    const rawCommand = `mv ${from} ${to}`;
    type = type || TYPE;

    logWithCommand(
      `Renaming ${from.split("/").pop()} to ${to.split("/").pop()}`,
      type,
      rawCommand,
      noIcon
    );

    const renameCommand = makeCommand(rawCommand);
    const command = spawn(...renameCommand);

    command.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });

    command.on("error", (error) => {
      reject(error);
    });
  });
}
