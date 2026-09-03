import type { CreateType } from "./types";

export type CreateTypeOption = {
  id: CreateType;
  name: string;
  description: string;
};

export const createTypeOptions: CreateTypeOption[] = [
  {
    id: "social-post",
    name: "Social post",
    description: "Create a polished visual for social media.",
  },
  {
    id: "quote",
    name: "Quote",
    description: "Turn a quote into a polished visual.",
  },
  {
    id: "thread",
    name: "Thread",
    description: "Turn longer text into a shareable visual.",
  },
];
