export const config = {
  mongodb: {
    uri: String(process.env.NEXT_PUBLIC_MONGODB_URI),
  },
  jwt: {
    secret: String(process.env.NEXT_PUBLIC_JWT_SECRET),
  },
  resend: {
    api: String(process.env.NEXT_PUBLIC_RESEND_API_KEY),
  },
  github: {
    clientId: String(process.env.AUTH_GITHUB_ID),
    clientSecret: String(process.env.AUTH_GITHUB_SECRET),
  },
  google: {
    clientId: String(process.env.GOOGLE_CLIENT_ID),
    clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
  },
  next: {
    baseUrl: String(process.env.NEXT_PUBLIC_BASE_URL),
  },
};
