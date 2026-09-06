export type SocialPostPreset = {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontWeight: string;
};

export const presets: SocialPostPreset[] = [
  {
    id: "dark",
    name: "Dark",
    backgroundColor: "#16181c",
    textColor: "#E7E9EA",
    secondaryColor: "rgba(231,233,234,0.8)",
    fontFamily: "sans-serif",
    fontWeight: "500",
  },
  {
    id: "light",
    name: "Light",
    backgroundColor: "#ffffff",
    textColor: "#0f1419",
    secondaryColor: "rgba(15,20,25,0.6)",
    fontFamily: "Inter",
    fontWeight: "500",
  },
  {
    id: "dim",
    name: "Dim",
    backgroundColor: "#15202b",
    textColor: "#e7e9ea",
    secondaryColor: "rgba(247,249,249,0.6)",
    fontFamily: "Inter",
    fontWeight: "400",
  },
  {
    id: "lights-out",
    name: "Lights Out",
    backgroundColor: "#000000",
    textColor: "#f5f5f5",
    secondaryColor: "rgba(245,245,245,0.6)",
    fontFamily: "Inter",
    fontWeight: "500",
  },
  {
    id: "paper",
    name: "Paper",
    backgroundColor: "#f8f4ea",
    textColor: "#2b2520",
    secondaryColor: "rgba(43,37,32,0.6)",
    fontFamily: "Georgia",
    fontWeight: "400",
  },
  {
    id: "mono",
    name: "Mono",
    backgroundColor: "#0d1117",
    textColor: "#c9d1d9",
    secondaryColor: "rgba(201,209,217,0.6)",
    fontFamily:
      '"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace',
    fontWeight: "400",
  },
  {
    id: "blush",
    name: "Blush",
    backgroundColor: "#fdf2f8",
    textColor: "#701a3a",
    secondaryColor: "rgba(112,26,58,0.6)",
    fontFamily: "Inter",
    fontWeight: "500",
  },
];