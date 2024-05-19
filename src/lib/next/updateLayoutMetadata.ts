import { PropertyAssignment, SourceFile, SyntaxKind } from "ts-morph";
import { logD, logN } from "../log/log";

const TYPE = "update";

export default function updateLayoutMetadata(
  sourceFile: SourceFile,
  projectPath: string
) {
  logN("Finding metadata object …", TYPE);
  const metadata = sourceFile.getVariableDeclarationOrThrow("metadata");
  const metadataObject = metadata.getInitializerIfKind(
    SyntaxKind.ObjectLiteralExpression
  );
  if (!metadataObject) throw new Error("Metadata object not found");
  logD();
  logN("Updating metadata title …", TYPE);
  const titleProperty = metadataObject.getProperty(
    "title"
  ) as PropertyAssignment;
  if (!titleProperty) throw new Error("Title property not found");
  const projectTitle = projectPath.split("/").pop();
  titleProperty.setInitializer(`"${projectTitle}"`);
  logD();
  logN("Updating metadata description …", TYPE);
  const descriptionProperty = metadataObject.getProperty(
    "description"
  ) as PropertyAssignment;
  if (!descriptionProperty) throw new Error("Description property not found");
  descriptionProperty.setInitializer(
    `"Temporary ${projectTitle} project description by create-next-app and again-cli"`
  );
  logD();
  logN("Adding metadata TODO …", TYPE);
  sourceFile.insertText(
    metadataObject.getStart(),
    "Update metadata".replace(/(.*)/, "TODO: $1").replace(/(.*)/, "// $1\n")
  );
  logD();
  logN("Saving layout file …", TYPE);
  sourceFile.saveSync();
  logD();
}
