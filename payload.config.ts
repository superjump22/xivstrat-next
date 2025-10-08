import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import { zh } from "payload/i18n/zh";
import sharp from "sharp";
import { Media } from "./collections/Media";
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
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  cors: [process.env.SERVER1_URL || "", process.env.SERVER2_URL || ""].filter(
    Boolean,
  ),
  csrf: [process.env.SERVER1_URL || "", process.env.SERVER2_URL || ""].filter(
    Boolean,
  ),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DB_URI || "",
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    s3Storage({
      collections: {
        media: true,
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
});
