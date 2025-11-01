export const DRAFT_KEYS = {
  admin: "draft_admin",
  ops: "draft_ops",
} as const;

export type DRAFT_KEYS = (typeof DRAFT_KEYS)[keyof typeof DRAFT_KEYS];
