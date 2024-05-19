import chalk from "chalk";
import { getLogConfig } from "./getLogConfig";
import { LogType } from "./log.d";
import { BB } from "./logConfig";

export default function log(message: string, type: LogType) {
  let { color } = getLogConfig(type);
  // process.stdout.write(
  //   message.replace(/[\n\r]/g, () => "\n" + color(BB) + " ")
  // );
  process.stdout.write("┃");
}

export function logN(text: string, type: LogType) {
  let { color } = getLogConfig(type);
  process.stdout.write(color(BB) + " " + text);
}

export function logH(text: string, type: LogType) {
  let { color } = getLogConfig(type);
  process.stdout.write(color(BB) + " " + text + "\n");
}

export function logD() {
  process.stdout.write(chalk.greenBright(" ✔") + "\n");
}
