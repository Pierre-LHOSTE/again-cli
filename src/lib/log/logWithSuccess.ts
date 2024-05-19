import c from "chalk";
import { getLogConfig } from "./getLogConfig";
import { LogType } from "./log.d";
import { BB } from "./logConfig";

export default function logWithSuccess(text: string, type: LogType) {
  let { color } = getLogConfig(type);
  const icon = "";
  process.stdout.write(
    color(BB) +
      "\n" +
      color(BB) +
      " " +
      c.greenBright(icon) +
      "  " +
      c.white(text) +
      "\n\n"
  );
}
