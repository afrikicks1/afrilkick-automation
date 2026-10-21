
const API_BASE = "https://api.footballsoccerapi.com/v1";

async function fetchFixtures() {
  const apiKey = process.env.FOOTBALL_SOCCER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing FOOTBALL_SOCCER_API_KEY repository secret.");
  }

  const response = await fetch(
    `${API_BASE}/fixtures/upcoming?days=7&limit=1000`,
    {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
        "Accept": "application/json"
      }
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Football Soccer API returned HTTP ${response.status}: ${
        JSON.stringify(result)
      }`
    );
  }

  const fixtures = (result.data || []).map((item) => ({
    id: String(item.match_id),
    league: item.league_name,
    country: item.country_name,
    homeTeam: item.home_team_name,
    awayTeam: item.away_team_name,
    kickoff: item.kickoff_utc
      ? new Date(item.kickoff_utc * 1000).toISOString()
      : null,
    status: item.match_status,
    homeGoals: item.home_goals ?? null,
    awayGoals: item.away_goals ?? null
  }));

  console.log(JSON.stringify(fixtures, null, 2));
  console.log(`Successfully fetched ${fixtures.length} fixtures.`);

  if (result.meta) {
    console.log("API metadata:", JSON.stringify(result.meta));
  }
}

fetchFixtures().catch((error) => {
  console.error("Fixture import failed:", error.message);
  process.exitCode = 1;
});
