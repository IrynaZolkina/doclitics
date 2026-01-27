export const PLANS = {
  free: {
    name: "Free",
    stripePriceId: null,
    amount: 5,
  },
  basic: {
    name: "Basic",
    stripePriceId: process.env.BASIC_SUB,
    amount: 5,
  },
  pro: {
    name: "Pro",
    stripePriceId: process.env.PRO_SUB,
    amount: 5,
  },
  premium: {
    name: "Premium",
    stripePriceId: process.env.PREMIUM_SUB,
    amount: 5,
  },
};
