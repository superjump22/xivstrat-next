import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: {
    adminThumbnail: "thumb",
    imageSizes: [
      {
        name: "thumb",
        width: 120,
        height: 120,
        generateImageName: ({ originalName, sizeName, extension }) =>
          `${originalName}-${sizeName}.${extension}`,
        withoutEnlargement: true,
      },
    ],
  },
};
