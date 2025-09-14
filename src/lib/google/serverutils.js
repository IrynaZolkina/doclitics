export function getGoogleAuthURL() {
  const root = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: ["openid", "email", "profile"].join(" "),
  };
  const qs = new URLSearchParams(options).toString();
  return `${root}?${qs}`;
}
