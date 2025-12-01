const BOTPRESS_HOST = "http://localhost:4000";
const BOT_ID = "customer_service";
const API_TOKEN_FULL =
  "bp.exe pull --url http://localhost:4000 --authToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtob2FpLnQwMzAyQGdtYWlsLmNvbSIsInN0cmF0ZWd5IjoiZGVmYXVsdCIsInRva2VuVmVyc2lvbiI6MSwiaXNTdXBlckFkbWluIjp0cnVlLCJpYXQiOjE3NjI5NDc3MDcsImV4cCI6MTc2Mjk1MTMwNywiYXVkIjoiY29sbGFib3JhdG9ycyJ9.OHRMVXWfQsxAKLuV5O0gSgPfKAesrUZU8MJlM4fwUiY --targetDir data";
const getApiToken = () => {
  return API_TOKEN_FULL.split("--authToken ")[1].split(" --targetDir")[0];
};

export const CHATBOT_CONFIG = {
  HOST: BOTPRESS_HOST,
  BOT_ID: BOT_ID,
  TOKEN: getApiToken(),
};
