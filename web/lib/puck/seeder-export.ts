import { serializePuckPageData } from "./page-builder-data";
import type { VmuFitPageBuilderData } from "./page-builder-data";

export type PuckSeederExportTarget = "page" | "site-layout";

export function createPuckSeederExpression(
  data: VmuFitPageBuilderData,
  target: PuckSeederExportTarget,
): string {
  const json = serializePuckPageData(data);

  if (target === "site-layout") {
    return createSiteLayoutSeederSnippet(json);
  }

  return `PuckSeedData::forPage(${createJsonHeredoc(json)})`;
}

function createJsonHeredoc(json: string): string {
  return `<<<'JSON'\n${json}\nJSON`;
}

function createSiteLayoutSeederSnippet(json: string): string {
  const helperCall = `PuckSeedData::splitSiteLayout(${createJsonHeredoc(json)})`;

  return [
    '$layoutData = ' + helperCall + ';',
    '',
    "'header_data' => $layoutData['header_data'],",
    "'footer_data' => $layoutData['footer_data'],",
    "'left_data' => $layoutData['left_data'],",
    "'right_data' => $layoutData['right_data'],",
  ].join("\n");
}
