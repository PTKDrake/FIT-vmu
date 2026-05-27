import { getInitialPageFromDOM } from "@inertiajs/core";

export interface InertiaCollectionRequestQuery {
  [key: string]: string | number | boolean | null | undefined;
}

export function buildInertiaCollectionUrl(query: InertiaCollectionRequestQuery): string {
  const url = new URL(window.location.href);
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    params.set(key, String(value));
  }

  const search = params.toString();

  url.search = search;

  return url.toString();
}

function resolveInertiaVersion(): string | null {
  try {
    const page = getInitialPageFromDOM<{ version?: string | null }>("app");

    return typeof page?.version === "string" && page.version !== "" ? page.version : null;
  } catch {
    return null;
  }
}

export async function fetchInertiaCollectionPage<Resource extends string, TItem>(
  resource: Resource,
  query: InertiaCollectionRequestQuery,
  signal: AbortSignal,
): Promise<{ items: TItem[]; meta: Record<string, unknown> | null }> {
  const version = resolveInertiaVersion();

  const response = await fetch(buildInertiaCollectionUrl(query), {
    credentials: "same-origin",
    headers: {
      "X-Inertia": "true",
      ...(version ? { "X-Inertia-Version": version } : {}),
      "X-Requested-With": "XMLHttpRequest",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Không thể tải dữ liệu từ ${resource}.`);
  }

  const payload = (await response.json()) as {
    props?: Record<string, { data?: TItem[]; meta?: unknown } | TItem[] | undefined>;
  } & Record<string, { data?: TItem[]; meta?: unknown } | TItem[] | undefined>;
  const pagePayload = payload.props ?? payload;
  const page = pagePayload[resource] as
    | { data?: TItem[]; meta?: unknown }
    | TItem[]
    | undefined;

  if (Array.isArray(page)) {
    return {
      items: page as TItem[],
      meta: null,
    };
  }

  return {
    items: (page?.data ?? []) as TItem[],
    meta: (page?.meta ?? null) as Record<string, unknown> | null,
  };
}
