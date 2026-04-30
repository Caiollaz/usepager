import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin"]);
export const projectStatus = pgEnum("project_status", ["published", "draft"]);
export const blockStatus = pgEnum("block_status", ["active", "review"]);
export const publicationStatus = pgEnum("publication_status", ["success", "failed"]);

export const user = pgTable("user", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  role: userRole().notNull().default("user"),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text().primaryKey(),
    expiresAt: timestamp().notNull(),
    token: text().notNull().unique(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId), index("session_expires_at_idx").on(table.expiresAt)],
);

export const account = pgTable(
  "account",
  {
    id: text().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp(),
    refreshTokenExpiresAt: timestamp(),
    scope: text(),
    password: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (table) => [index("account_user_id_idx").on(table.userId), index("account_provider_account_idx").on(table.providerId, table.accountId)],
);

export const verification = pgTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const jwks = pgTable("jwks", {
  id: text().primaryKey(),
  publicKey: text().notNull(),
  privateKey: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  expiresAt: timestamp(),
});

export const projects = pgTable(
  "projects",
  {
    id: text().primaryKey(),
    ownerId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text().notNull(),
    slug: text().notNull().unique(),
    subdomain: text().notNull().unique(),
    domain: text().notNull(),
    status: projectStatus().notNull().default("draft"),
    description: text(),
    metaTitle: text(),
    metaDescription: text(),
    customDomain: text(),
    faviconAssetId: text(),
    settingsJson: text().notNull().default("{}"),
    publishedAt: timestamp(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (table) => [index("projects_owner_id_idx").on(table.ownerId), index("projects_owner_status_idx").on(table.ownerId, table.status)],
);

export const pages = pgTable(
  "pages",
  {
    id: text().primaryKey(),
    projectId: text()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text().notNull(),
    slug: text().notNull(),
    html: text().notNull().default(""),
    css: text().notNull().default(""),
    grapesJson: text().notNull().default("{}"),
    metaTitle: text(),
    metaDescription: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (table) => [uniqueIndex("pages_project_slug_unique").on(table.projectId, table.slug), index("pages_project_id_idx").on(table.projectId)],
);

export const blocks = pgTable(
  "blocks",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    category: text().notNull(),
    status: blockStatus().notNull().default("active"),
    usageCount: integer().notNull().default(0),
    html: text().notNull().default(""),
    css: text().notNull().default(""),
    schemaJson: text().notNull().default("{}"),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (table) => [index("blocks_status_idx").on(table.status), index("blocks_category_idx").on(table.category)],
);

export const assets = pgTable(
  "assets",
  {
    id: text().primaryKey(),
    projectId: text()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    fileName: text().notNull(),
    mimeType: text().notNull(),
    size: integer().notNull(),
    url: text().notNull(),
    storagePath: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [index("assets_project_id_idx").on(table.projectId), uniqueIndex("assets_url_unique").on(table.url)],
);

export const publications = pgTable(
  "publications",
  {
    id: text().primaryKey(),
    projectId: text()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    status: publicationStatus().notNull(),
    targetPath: text().notNull(),
    errorMessage: text(),
    createdAt: timestamp().notNull().defaultNow(),
    publishedAt: timestamp(),
  },
  (table) => [index("publications_project_id_idx").on(table.projectId), index("publications_created_at_idx").on(table.createdAt)],
);
