export type Photo = {
  src: string;
  alt: string;
};

export const photos: Photo[] = [
  { src: "/assets/images/IMG_7008.jpg", alt: "Camps Bay" },
  { src: "/assets/images/IMG_7011.jpg", alt: "Mokoro" },
  { src: "/assets/images/IMG_7013.jpg", alt: "Victoria Falls" },
  { src: "/assets/images/IMG_7015.jpg", alt: "Vic Falls Bridge" },
  { src: "/assets/images/IMG_7009.jpg", alt: "Table Mountain" },
  { src: "/assets/images/IMG_7012.jpg", alt: "Elephants" },
  { src: "/assets/images/IMG_7010.jpg", alt: "Safari Car" },
  { src: "/assets/images/IMG_7017.jpg", alt: "Elephant Skull" },
];

export const PHOTOS_PER_PAGE = 6;
