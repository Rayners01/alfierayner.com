export type Social = {
  label: string;
  href: string;
  icon: string;
};

export const socials: Social[] = [
  {
    label: "GitHub",
    href: "https://www.github.com/Rayners01",
    icon: "/assets/github.svg",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/alfie-rayner-ab64a633a/",
    icon: "/assets/linkedin.svg",
  },
];

export const profile = {
  name: "Alfie Rayner",
  greeting: "welcome",
  headline: "a Computer Science student at the University of Warwick",
  portrait: {
    src: "/assets/alfie_rayner.jpg",
    alt: "Photo of Alfie Rayner, taken at Victoria Falls, Zimbabwe.",
  },
} as const;

export const contact = {
  email: "contact@alfierayner.com",
  phone: "+44 7576 998476",
} as const;

export const about = {
  intro: [
    "I'm a software developer from Brighton, England.",
    "Currently, I am in my second-year of my MEng Computer Science degree at the University of Warwick.",
  ],
  interestsLead: "My main interests in Computer Science include:",
  interests: ["Full-stack Development", "Artificial Intelligence", "Data Science"],
  outro: [
    "I primarily code in Java and JavaScript, however I also have experience using Python, C and C#.",
    "Beyond programming, I'm passionate about many things including playing the piano, polo, photography, skiing, football and travelling.",
  ],
} as const;
