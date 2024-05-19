import c from "chalk";
import { LogType } from "./log.d";

export function getLogConfig(type: LogType) {
  const config = {
    color: c.white,
    icon: "",
  };
  switch (type) {
    case "command":
      config.color = c.blue;
      config.icon = "";
      break;
    case "install":
      config.color = c.redBright;
      config.icon = "󰇚";
      break;
    case "rename":
      config.color = c.white;
      config.icon = "";
      break;
    case "curl":
      config.color = c.yellow;
      config.icon = "󰇚";
      break;
    case "update":
      config.color = c.magentaBright;
      config.icon = "";
      break;
    case "delete":
      config.color = c.red;
      config.icon = "󰓾";
      break;
    case "storybook":
      config.color = c.magenta;
      config.icon = "";
      break;
    case "prisma":
      config.color = c.cyan;
      config.icon = "";
      break;
    case "next":
      config.color = c.white;
      config.icon = "󰔶";
      break;
    case "prettier":
      config.color = c.blue;
      config.icon = "";
      break;
    case "git":
      config.color = c.redBright;
      config.icon = "";
      break;
    case "again":
      config.color = c.yellow;
      config.icon = "󰣙";
      break;
  }
  return config;
}
/*
export default function getLogConfig_old(
  name: string,
  type: string,
  rawCommand?: string
) {
  const logConfig = {
    color: c.white,
    loading: "Step " + name + "…",
    success: name + " completed!",
    icon: c.white(""),
  };

  switch (type) {
    case "npm":
      logConfig.color = c.redBright;
      logConfig.loading = `Running ${name} command …`;
      logConfig.success = `Command ${name} completed!`;
      logConfig.icon = "";
      switch (name.toLowerCase()) {
        case "create-next-app":
          logConfig.color = c.white;
          logConfig.icon = "󰔶";
          break;
        case "storybook":
          logConfig.color = c.magenta;
          logConfig.loading = "Initializing Storybook …";
          logConfig.success = "Storybook initialized!";
          logConfig.icon = "";
          break;
        case "prisma":
          logConfig.color = c.cyan;
          logConfig.loading = "Initializing Prisma …";
          logConfig.success = "Prisma initialized!";
          logConfig.icon = "";
          break;
        case "prettier":
          logConfig.color = c.blue;
          logConfig.loading = "Running prettier …";
          logConfig.success = "Prettier completed!";
          logConfig.icon = "";
          break;
      }
      break;
    case "install":
      logConfig.color = c.redBright;
      logConfig.loading = `Installing ${name} …`;
      logConfig.success = `${name} installed!`;
      logConfig.icon = "󰇚";
      break;
    case "rename":
      logConfig.color = c.white;
      logConfig.loading = `Renaming ${name} …`;
      logConfig.success = `File ${name} renamed!`;
      logConfig.icon = "";
      break;
    case "curl":
      logConfig.color = c.yellow;
      logConfig.loading = `Adding ${name} …`;
      logConfig.success = `File ${name} added!`;
      logConfig.icon = "󰇚";
      break;
    case "move":
      logConfig.color = c.magenta;
      logConfig.loading = `Moving ${name} …`;
      logConfig.success = `File ${name} moved!`;
      logConfig.icon = "󰇚";
      break;

    default:
      break;
  }

  return {
    ...logConfig,
    loading:
      logConfig.color(logConfig.icon) +
      " " +
      c.white(logConfig.loading) +
      "\n" +
      c.dim("󱞩 " + rawCommand),
    success: c.greenBright("") + " " + c.white(logConfig.success),
  };
}
*/
