import { SourceFile } from "ts-morph";
import { logD, logN } from "../log/log";

const TYPE = "delete";

export default function removeStyleImports(sourceFile: SourceFile) {
  logN(`From ${sourceFile.getBaseName()} …`, TYPE);
  const importLayoutDeclarations = sourceFile.getImportDeclarations();
  importLayoutDeclarations.forEach((importDeclaration) => {
    const moduleSpecifier = importDeclaration.getModuleSpecifierValue();
    if (moduleSpecifier.endsWith(".css")) {
      importDeclaration.replaceWithText("");
    }
  });
  logD();
  sourceFile.saveSync();
}
