export type Project = {
  name: string;
  href: string;
  image: { src: string; alt: string };
};

export const projects: Record<"kilimanjaro" | "firstChair", Project> = {
  kilimanjaro: {
    name: "Kilimanjaro fundraiser",
    href: "/kilimanjaro",
    image: { src: "/assets/kili.png", alt: "Kilimanjaro landscape" },
  },
  firstChair: {
    name: "First Chair",
    href: "https://firstchair.alfierayner.com",
    image: { src: "/assets/first_chair.png", alt: "First Chair" },
  },
};
