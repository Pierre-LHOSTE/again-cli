import { spawn } from "child_process";
import makeCommand from "../makeCommand";

export default function removeStyleFiles() {
  return new Promise<void>((resolve, reject) => {
    const rawCommand = `find ./src/app -type f -name "*.css" -delete`;
    const commandArgs = makeCommand(rawCommand);
    const command = spawn(...commandArgs, {
      shell: true,
    });

    command.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    command.on("error", (err) => {
      reject(err);
    });
  });
}
