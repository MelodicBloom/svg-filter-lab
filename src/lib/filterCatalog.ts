import catalog from '../../packages/svg-filters/filter-catalog.json'

export type FilterCatalogEntry = (typeof catalog.filters)[number]

export const FILTER_INDEX = catalog.filters.reduce<Record<string, FilterCatalogEntry>>(
  (acc, entry) => {
    acc[entry.id] = entry
    return acc
  },
  {}
)

export function getFilterById(id: string) {
  return FILTER_INDEX[id] ?? null
}

export function getFilterBySlug(slug: string) {
  return catalog.filters.find((entry) => entry.slug === slug) ?? null
}

export function listFiltersByCategory(category: string) {
  return catalog.filters.filter((entry) => entry.category === category)
}

export function listAllFilters() {
  return catalog.filters
}
