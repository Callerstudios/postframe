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
    description: "Create a visual post for social media.",
  },
  {
    id: "quote",
    name: "Quote",
    description: "Turn a quote into a polished visual.",
  },
  {
    id: "announcement",
    name: "Announcement",
    description: "Share an important message or update.",
  },
  {
    id: "thread",
    name: "Thread / Text",
    description: "Turn longer text into a shareable visual.",
  },
  {
    id: "custom",
    name: "Custom",
    description: "Start with a blank canvas.",
  },
];
