import { customAlphabet } from "nanoid";
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
  hooks: {
    beforeOperation: [
      ({ req, operation }) => {
        if ((operation === "create" || operation === "update") && req.file) {
          const originalName = req.file.name ?? "";
          const dotIndex = originalName.lastIndexOf(".");
          const ext =
            dotIndex > -1 ? originalName.slice(dotIndex + 1).toLowerCase() : "";
          const alphabet =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
          const nanoid = customAlphabet(alphabet, 24);
          const id = nanoid();
          req.file.name = ext ? `${id}.${ext}` : id;
        }
      },
    ],
  },
};
