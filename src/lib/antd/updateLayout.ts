import { Project } from "ts-morph";
import { logD, logN } from "../log/log";
import logWithIcon from "../log/logWithIcon";
import logWithSuccess from "../log/logWithSuccess";

const TYPE = "update";

export default function updateLayout(project: Project) {
  logWithIcon("Updating layout.tsx for AntDesign …", TYPE);
  const layoutFile = project.getSourceFileOrThrow("src/app/layout.tsx");
  logN("Adding imports …", TYPE);
  layoutFile.addImportDeclarations([
    {
      defaultImport: "AntConfig",
      moduleSpecifier: "./AntConfig",
    },
    {
      defaultImport: "AntRegistry",
      moduleSpecifier: "./AntRegistry",
    },
  ]);
  logD();
  logN("Update jsx return …", TYPE);
  const rootLayoutFunction = layoutFile.getFunctionOrThrow("RootLayout");
  rootLayoutFunction.setBodyText(`
return (
  <html lang="en">
    <body className={inter.className}>
      <AntRegistry>
        <AntConfig>
          {children}
        </AntConfig>
      </AntRegistry>
    </body>
  </html>
);
  `);
  logD();
  logN("Saving layout.tsx …", TYPE);
  layoutFile.saveSync();
  logD();
  logWithSuccess("Imports added", TYPE);
}
