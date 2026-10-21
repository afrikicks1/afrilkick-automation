
const API_BASE = "https://v3.football.api-sports.io";

async function fetchFixtures() {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    throw new Error("Missing API_FOOTBALL_KEY environment secret.");
  }

  const today = new Date().toISOString().slice(0, 10);
  const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const response = await fetch(
    `${API_BASE}/fixtures?from=${today}&to=${endDate}&timezone=UTC`,
    {
      headers: {
        "x-apisports-key": apiKey
      }
    }
  );

  if (!response.ok) {
    throw new Error(`API-Football returned HTTP ${response.status}`);
  }

  const result = await response.json();

  if (result.errors && Object.keys(result.errors).length > 0) {
    throw new Error(`API-Football API error: ${JSON.stringify(result.errors)}`);
  }

  const fixtures = (result.response || []).map((item) => ({
    id: String(item.fixture.id),
    league: item.league.name,
    country: item.league.country,
    homeTeam: item.teams.home.name,
    awayTeam: item.teams.away.name,
    kickoff: item.fixture.date,
    status: item.fixture.status.short,
    homeGoals: item.goals.home,
    awayGoals: item.goals.away
  }));

  console.log(JSON.stringify(fixtures, null, 2));
  return fixtures;
}

fetchFixtures().catch((error) => {
  console.error("Fixture import failed:", error.message);
  process.exitCode = 1;
});
