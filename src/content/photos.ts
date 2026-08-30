export type Photo = {
  src: string;
  /** Shown under the photo, and used as its alt text. */
  caption: string;
};

export const photos: Photo[] = [
  { src: "/assets/images/IMG_7008.jpg", caption: "Camps Bay" },
  { src: "/assets/images/IMG_7011.jpg", caption: "Mokoro" },
  { src: "/assets/images/IMG_7013.jpg", caption: "Victoria Falls" },
  { src: "/assets/images/IMG_7015.jpg", caption: "Vic Falls Bridge" },
  { src: "/assets/images/IMG_7009.jpg", caption: "Table Mountain" },
  { src: "/assets/images/IMG_7012.jpg", caption: "Elephants" },
  { src: "/assets/images/IMG_7010.jpg", caption: "Safari Car" },
  { src: "/assets/images/IMG_7017.jpg", caption: "Elephant Skull" },
];

export const PHOTOS_PER_PAGE = 6;
