import { spawnSync } from "child_process";
import {
  AntConfigURL,
  AntRegistryURL,
  darkThemeURL,
  lightThemeURL,
} from "../../config/urls";
import { logD, logN } from "../log/log";
import logWithCommand from "../log/logWithCommand";
import logWithIcon from "../log/logWithIcon";
import logWithSuccess from "../log/logWithSuccess";

const TYPE = "curl";

export default async function addAntFile() {
  logWithIcon("Adding AntDesign files …", TYPE);
  const rawRegistryCommand = `curl --no-progress-meter -o "./src/app/AntRegistry.tsx" "${AntRegistryURL}"`;
  logWithCommand("Adding registry …", TYPE, rawRegistryCommand, true);
  spawnSync(rawRegistryCommand, {
    shell: true,
  });
  logN("AntRegistry.tsx downloaded", TYPE);
  logD();

  const rawConfigCommand = `curl --no-progress-meter -o "./src/app/AntConfig.tsx" "${AntConfigURL}"`;
  logWithCommand("Adding config …", TYPE, rawConfigCommand, true);
  spawnSync(rawConfigCommand, {
    shell: true,
  });
  logN("AntConfig.tsx downloaded", TYPE);
  logD();

  logN("Creating themes directory …", TYPE);
  const rawDirCommand = `mkdir -p ./src/styles/themes`;
  spawnSync(rawDirCommand, { shell: true });
  logD();

  const rawDarkThemeCommand = `curl --no-progress-meter -o "./src/styles/themes/dark.tsx" "${darkThemeURL}"`;
  logWithCommand("Adding dark theme …", TYPE, rawDarkThemeCommand, true);
  spawnSync(rawDarkThemeCommand, { shell: true });
  logN("Dark theme downloaded", TYPE);
  logD();

  const rawLightThemeCommand = `curl --no-progress-meter -o "./src/styles/themes/light.tsx" "${lightThemeURL}"`;
  logWithCommand("Adding light theme …", TYPE, rawLightThemeCommand, true);
  spawnSync(rawLightThemeCommand, { shell: true });
  logN("Light theme downloaded", TYPE);
  logD();

  logWithSuccess("Ant Design files added", TYPE);
}
