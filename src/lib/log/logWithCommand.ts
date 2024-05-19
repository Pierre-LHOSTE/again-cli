import c from "chalk";
import { getLogConfig } from "./getLogConfig";
import { LogType } from "./log.d";
import { BB } from "./logConfig";

export default function logWithCommand(
  text: string,
  type: LogType,
  command: string,
  noIcon?: boolean
) {
  let { color, icon } = getLogConfig(type);
  process.stdout.write(
    color(BB) +
      (noIcon ? "" : " " + color(icon) + " ") +
      " " +
      text +
      "\n" +
      color(BB) +
      " " +
      c.dim(" 󱞩 " + command) +
      "\n" +
      (noIcon ? "" : color(BB) + "\n")
  );
}
