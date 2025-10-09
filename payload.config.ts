import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import { zh } from "payload/i18n/zh";
import sharp from "sharp";
import { Assets } from "./collections/Assets";
import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoRefresh: true,
    dateFormat: "yyyy-MM-dd HH:mm:ss",
    suppressHydrationWarning: true,
  },
  collections: [Users, Assets],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  serverURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.SERVER_URL,
  cors: [process.env.SERVER_URL || ""].filter(Boolean),
  csrf: [process.env.SERVER_URL || ""].filter(Boolean),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DB_URI || "",
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      // 腾讯云COS兼容S3 API：https://cloud.tencent.com/document/product/436/37421
      collections: {
        assets: true,
      },
      bucket: process.env.COS_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.COS_SECRET_ID || "",
          secretAccessKey: process.env.COS_SECRET_KEY || "",
        },
        region: process.env.COS_REGION || "",
        endpoint: process.env.COS_ENDPOINT || "",
      },
    }),
  ],
  telemetry: false,
  i18n: {
    supportedLanguages: { zh },
  },
  localization: {
    locales: [
      { code: "zh", label: "中文", fallbackLocale: "jp" },
      { code: "jp", label: "日文", fallbackLocale: "en" },
      { code: "en", label: "英文" },
    ],
    defaultLocale: "zh",
  },
  upload: {
    abortOnLimit: true,
    uploadTimeout: 120 * 1000,
    limits: {
      fileSize: 32 * 1024 * 1024,
    },
  },
});
