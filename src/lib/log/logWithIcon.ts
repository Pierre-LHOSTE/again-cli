import chalk from "chalk";
import { getLogConfig } from "./getLogConfig";
import { LogType } from "./log.d";
import { BB } from "./logConfig";

export default function logWithIcon(text: string, type: LogType) {
  let { color, icon } = getLogConfig(type);
  process.stdout.write(
    color(BB) + " " + color(icon) + "  " + chalk.white(text)
  );
  process.stdout.write("\n" + color(BB) + "\n");
}
