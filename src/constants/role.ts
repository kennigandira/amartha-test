export const Role = {
  OPS: "ops",
  ADMIN: "admin",
  ENGINEER: "engineer",
  FINANCE: "finance",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
