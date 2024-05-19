import { SourceFile } from "ts-morph";
import { logD, logN } from "../log/log";

const TYPE = "update";

export default function updatePageReturn(sourceFile: SourceFile) {
  logN("Finding Home function …", TYPE);
  const homeFunction = sourceFile
    .getFunctions()
    .find((func) => func.isDefaultExport() && func.getName() === "Home");
  if (!homeFunction) throw new Error("Home function not found");
  logD();
  logN("Updating Home function return …", TYPE);
  homeFunction.setBodyText(`return (<>Home</>);`);
  logD();
  logN("Saving page file …", TYPE);
  sourceFile.saveSync();
  logD();
}
