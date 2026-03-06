/**
 * setup-project.ts
 *
 * Run after deploying a new client site to Vercel.
 * Sets the Supabase DATABASE_URL, DIRECT_URL, and PROJECT_ID
 * env vars on the Vercel project automatically.
 *
 * Usage:
 *   npx tsx scripts/setup-project.ts \
 *     --project-id "cuid_from_klienti" \
 *     --vercel-project-id "prj_xxxx"
 *
 * Required env vars:
 *   DATABASE_URL       - Supabase pooled connection string
 *   DIRECT_URL         - Supabase direct connection string
 *   VERCEL_TOKEN       - Vercel API token
 *   VERCEL_TEAM_ID     - Vercel team ID (optional)
 */

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
const DATABASE_URL = process.env.DATABASE_URL;
const DIRECT_URL = process.env.DIRECT_URL;

function parseArgs(args: string[]) {
  const parsed: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--") && i + 1 < args.length) {
      const key = args[i].slice(2);
      parsed[key] = args[++i];
    }
  }
  return parsed;
}

async function setVercelEnvVar(
  vercelProjectId: string,
  key: string,
  value: string
) {
  const url = new URL(
    `https://api.vercel.com/v10/projects/${vercelProjectId}/env`
  );
  if (VERCEL_TEAM_ID) url.searchParams.set("teamId", VERCEL_TEAM_ID);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VERCEL_TOKEN}`,
    },
    body: JSON.stringify({
      key,
      value,
      type: "encrypted",
      target: ["production", "preview"],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to set env var ${key}: ${res.status} ${text}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const projectId = args["project-id"];
  const vercelProjectId = args["vercel-project-id"];

  if (!projectId || !vercelProjectId) {
    console.error(
      "Usage: npx tsx scripts/setup-project.ts --project-id 'cuid' --vercel-project-id 'prj_xxxx'"
    );
    process.exit(1);
  }

  if (!VERCEL_TOKEN) {
    console.error("Missing VERCEL_TOKEN env var");
    process.exit(1);
  }
  if (!DATABASE_URL || !DIRECT_URL) {
    console.error("Missing DATABASE_URL or DIRECT_URL env var");
    process.exit(1);
  }

  console.log(`Setting env vars on Vercel project ${vercelProjectId}...`);
  await setVercelEnvVar(vercelProjectId, "DATABASE_URL", DATABASE_URL);
  await setVercelEnvVar(vercelProjectId, "DIRECT_URL", DIRECT_URL);
  await setVercelEnvVar(vercelProjectId, "PROJECT_ID", projectId);
  console.log(`  Env vars set: DATABASE_URL, DIRECT_URL, PROJECT_ID`);

  console.log(`\nDone! Project is now connected to shared Supabase DB.`);
  console.log(`  Project ID: ${projectId}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
