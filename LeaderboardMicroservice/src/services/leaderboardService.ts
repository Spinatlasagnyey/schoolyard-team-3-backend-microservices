import { LaravelClient } from './laravelClient';

export type LeaderboardRow = {
  id: number | string;
  student_name: string;
  class_id: number | string;
  likes: number;
  dislikes: number;
  score: number;
};

type GetLeaderboardArgs = {
  limit?: number;
};

const client = new LaravelClient({
  baseUrl: process.env.LARAVEL_BASE_URL || 'http://localhost',
});

function toNumber(v: unknown, fallback = 0): number {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeRow(row: any): LeaderboardRow {
  const likes = toNumber(row?.likes, 0);
  const dislikes = toNumber(row?.dislikes, 0);

  // If Laravel already returns score, keep it; otherwise compute
  const score =
    row?.score !== undefined && row?.score !== null
      ? toNumber(row.score, likes - dislikes)
      : likes - dislikes;

  return {
    id: row?.id ?? row?.design_id ?? row?.student_id ?? row?.user_id ?? row?.uuid ?? 'unknown',
    student_name: String(row?.student_name ?? row?.name ?? row?.student ?? ''),
    class_id: row?.class_id ?? row?.class ?? row?.school_class_id ?? 'unknown',
    likes,
    dislikes,
    score,
  };
}

export async function getLeaderboard(args: GetLeaderboardArgs): Promise<LeaderboardRow[]> {
  const path = process.env.LARAVEL_LEADERBOARD_PATH || '/api/leaderboard';
  const defaultLimit = Number(process.env.DEFAULT_LIMIT || 10);

  const limit = args.limit ?? defaultLimit;

  // Ask Laravel with limit. If Laravel ignores it, we slice after sorting.
  const raw = await client.getJson<any>(path, { limit });

  // Laravel might return:
  // - array
  // - { data: [...] }
  // - paginator shape
  const rows: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.items)
        ? raw.items
        : Array.isArray(raw?.results)
          ? raw.results
          : [];

  const normalized = rows.map(normalizeRow);

  const sortLocally = String(process.env.SORT_LOCALLY || 'true').toLowerCase() === 'true';
  if (sortLocally) {
    normalized.sort((a, b) => b.score - a.score);
  }

  return normalized.slice(0, limit);
}
