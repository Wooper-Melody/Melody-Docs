import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { Options } from "./quartz/components/Explorer"
import { FileTrieNode } from "./quartz/util/fileTrie"

// Función de ordenamiento personalizada para el explorador
// Define el orden de las carpetas principales (ajusta según tus necesidades)
const customSortFn: Options["sortFn"] = (a, b) => {
  // Orden personalizado para carpetas principales (ajusta estos nombres según tus carpetas)
  const folderOrder = [
    "Arquitectura",
    "Servicios",
    "Frontend",
    "Gestión",
    "Aprendizaje y Mejoras",
  ]

  // Mantener carpetas primero, luego archivos
  if (!a.isFolder && b.isFolder) {
    return 1
  }
  if (a.isFolder && !b.isFolder) {
    return -1
  }

  // Si ambos son carpetas o ambos son archivos
  const aIndex = folderOrder.indexOf(a.displayName)
  const bIndex = folderOrder.indexOf(b.displayName)

  // Si ambos están en la lista de orden personalizado
  if (aIndex !== -1 && bIndex !== -1) {
    return aIndex - bIndex
  }

  // Si solo uno está en la lista, ponerlo primero
  if (aIndex !== -1) {
    return -1
  }
  if (bIndex !== -1) {
    return 1
  }

  // Si ninguno está en la lista, ordenar alfabéticamente
  return a.displayName.localeCompare(b.displayName, undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      sortFn: customSortFn,
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      sortFn: customSortFn,
    }),
  ],
  right: [],
}
