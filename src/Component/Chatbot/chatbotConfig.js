const BOTPRESS_HOST = "http://localhost:4000";
const BOT_ID = "customer_service_v2";
const API_TOKEN_FULL =
  "bp.exe pull --url http://localhost:4000 --authToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtob2FpLnQwMzAyQGdtYWlsLmNvbSIsInN0cmF0ZWd5IjoiZGVmYXVsdCIsInRva2VuVmVyc2lvbiI6MSwiaXNTdXBlckFkbWluIjp0cnVlLCJpYXQiOjE3NjExNzg2NTcsImV4cCI6MTc2MTE4MjI1NywiYXVkIjoiY29sbGFib3JhdG9ycyJ9.etqeuWji8dOdAL3pskU81CfE9y9XLnMYRDV3Ti-iozE --targetDir data";
const getApiToken = () => {
  return API_TOKEN_FULL.split("--authToken ")[1].split(" --targetDir")[0];
};

export const CHATBOT_CONFIG = {
  HOST: BOTPRESS_HOST,
  BOT_ID: BOT_ID,
  TOKEN: getApiToken(),
};
