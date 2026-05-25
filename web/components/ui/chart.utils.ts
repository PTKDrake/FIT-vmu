export const CHART_COLORS = {
  "chart-1": "var(--chart-1)",
  "chart-2": "var(--chart-2)",
  "chart-3": "var(--chart-3)",
  "chart-4": "var(--chart-4)",
  "chart-5": "var(--chart-5)",
} as const

export type ChartColorKeys = keyof typeof CHART_COLORS | (string & {})

export const DEFAULT_COLORS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] as const

export function valueToPercent(value: number): string {
  return `${(value * 100).toFixed(0)}%`
}

export function constructCategoryColors(
  categories: string[],
  colors: readonly ChartColorKeys[],
): Map<string, ChartColorKeys> {
  const categoryColors = new Map<string, ChartColorKeys>()

  categories.forEach((category, index) => {
    const color = colors[index % colors.length]
    if (color !== undefined) {
      categoryColors.set(category, color)
    }
  })

  return categoryColors
}

export function getColorValue(color?: string): string {
  if (!color) {
    return "var(--chart-1)"
  }

  return CHART_COLORS[color as "chart-1"] ?? color
}
