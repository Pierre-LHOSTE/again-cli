import { getLogConfig } from "./getLogConfig";
import log from "./log";
import { LogType } from "./log.d";
import { BB } from "./logConfig";

export default function handleProcessEvents(cmdProcess: any, type: LogType) {
  let { color } = getLogConfig(type);
  return new Promise<void>((resolve, reject) => {
    process.stdout.write(color(BB) + " ");
    cmdProcess.stdout.on("data", (data: any) => log(data.toString(), type));
    cmdProcess.stderr.once("data", (data: any) => log(data.toString(), type));
    cmdProcess.once("error", (error: any) => log(error.message, type));
    cmdProcess.stdout.once("close", (code: any) => {
      process.stdout.write("\n");
      resolve();
    });
  });
}
