import { customAlphabet } from "nanoid";
import type { CollectionConfig } from "payload";

export const Assets: CollectionConfig = {
  slug: "assets",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "originalFilename",
      type: "text",
      hidden: true,
      required: true,
      defaultValue: ({ req }) => req.context.originalFilename ?? "",
    },
  ],
  upload: {
    adminThumbnail: "thumb",
    imageSizes: [
      {
        // 经sharp压缩优化的图，通常情况下在Nextjs里用这个图
        name: "sharp",
        generateImageName: ({ originalName, sizeName, extension }) =>
          `${originalName}-${sizeName}.${extension}`,
        withoutEnlargement: true,
        withoutReduction: true,
        formatOptions: {
          format: "webp",
        },
      },
      {
        // 缩略图，给Admin Panel列表展示用的
        name: "thumb",
        width: 120,
        height: 120,
        generateImageName: ({ originalName, sizeName, extension }) =>
          `${originalName}-${sizeName}.${extension}`,
        withoutEnlargement: true,
        formatOptions: {
          format: "webp",
        },
      },
    ],
  },
  hooks: {
    beforeOperation: [
      // 上传文件前，随机取一个nanoid作为文件名
      ({ req, operation }) => {
        if ((operation === "create" || operation === "update") && req.file) {
          const originalName = req.file.name ?? "";
          // 存到context里以便originalFilename字段使用
          req.context.originalFilename = originalName;
          const dotIndex = originalName.lastIndexOf(".");
          const ext =
            dotIndex > -1 ? originalName.slice(dotIndex + 1).toLowerCase() : "";
          const alphabet =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
          const nanoid = customAlphabet(alphabet, 20);
          const id = nanoid();
          req.file.name = ext ? `${id}.${ext}` : id;
        }
      },
    ],
  },
};
