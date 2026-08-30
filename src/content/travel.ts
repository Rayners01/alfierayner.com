/**
 * Countries I have visited, as World Bank two-letter codes (`WB_A2`) — the
 * property carried by the Natural Earth GeoJSON the globe renders.
 */
export const visitedCountryCodes: ReadonlySet<string> = new Set([
  "US", "BB", "LC", "AG", "GB", "FR", "ES", "IT", "VA", "CH",
  "BE", "NL", "LU", "AT", "DE", "CZ", "PL", "HU", "HR", "GR",
  "CY", "ZA", "BW", "ZW", "ZM", "TZ", "KE", "QA",
]);

export const travel = {
  tileAlt: "World map",
  globeHeading: "Countries I have visited",
} as const;
