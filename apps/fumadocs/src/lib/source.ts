import { docs } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";
// biome-ignore lint/performance/noNamespaceImport: <explanation>
import * as icons from "lucide-static";

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: "/docs",
  icon(icon) {
    if (!icon) {
      return;
    }

    if (icon in icons) {
      // biome-ignore lint/performance/noDynamicNamespaceImportAccess: We need access to all icons for the CMS
      return icons[icon as keyof typeof icons];
    }
  },
});
