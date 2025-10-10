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
    },
  ],
  upload: {
    adminThumbnail: "thumb",
    crop: false, // 关闭裁剪工具，有bug，对已有图片重新上传又同时裁剪时，会导致数据错误。建议在上传之前就用PS处理好
    focalPoint: false, // 同上
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
      ({ req, operation }) => {
        // 上传文件时，将文件名改为随机的nanoid
        if ((operation === "create" || operation === "update") && req.file) {
          // 生成随机的nanoid
          const alphabet =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
          const nanoid = customAlphabet(alphabet, 20)();
          // 保留原文件名
          const originalFilename = req.file.name ?? "";
          if (req.data) {
            req.data.originalFilename = originalFilename;
          } else {
            req.data = {
              originalFilename,
            };
          }
          // 尝试保留原拓展名并统一转为小写
          const dotIndex = originalFilename.lastIndexOf(".");
          const ext =
            dotIndex > -1
              ? originalFilename.slice(dotIndex + 1).toLowerCase()
              : "";
          // 修改文件名，这里改了之后，generateImageName里的originalName就会变成下面的值
          req.file.name = ext ? `${nanoid}.${ext}` : nanoid;
        }
      },
    ],
  },
};
