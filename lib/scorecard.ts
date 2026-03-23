// lib/scorecard.ts
export type SchoolResult = {
  id: number;
  "school.name": string;
  "school.city"?: string;
  "school.state"?: string;
};

type ScorecardResponse = {
  results: SchoolResult[];
};

const BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools";

export async function searchSchools(params: {
  apiKey: string;
  query: string;
  perPage?: number;
}): Promise<SchoolResult[]> {
  const { apiKey, query, perPage = 10 } = params;

  const q = query.trim();
  if (q.length < 2) return [];

  const fields = ["id", "school.name", "school.city", "school.state"].join(",");

  const url =
    `${BASE_URL}?` +
    `api_key=${encodeURIComponent(apiKey)}` +
    `&school.name__contains=${encodeURIComponent(q)}` +
    `&fields=${encodeURIComponent(fields)}` +
    `&per_page=${encodeURIComponent(String(perPage))}`;

  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Scorecard API error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as ScorecardResponse;
  return data.results ?? [];
}