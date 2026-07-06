import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Portfolio-specific tables for dynamic content management

export const portfolioProjects = mysqlTable("portfolio_projects", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  technologies: json("technologies").$type<string[]>().notNull(),
  imageUrl: text("imageUrl"),
  projectUrl: text("projectUrl"),
  githubUrl: text("githubUrl"),
  featured: int("featured").default(0).notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type InsertPortfolioProject = typeof portfolioProjects.$inferInsert;

export const portfolioSkills = mysqlTable("portfolio_skills", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 100 }).notNull(),
  skills: json("skills").$type<string[]>().notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioSkill = typeof portfolioSkills.$inferSelect;
export type InsertPortfolioSkill = typeof portfolioSkills.$inferInsert;

export const portfolioAbout = mysqlTable("portfolio_about", {
  id: int("id").autoincrement().primaryKey(),
  bio: text("bio").notNull(),
  education: text("education").notNull(),
  interests: json("interests").$type<string[]>().notNull(),
  profileImageUrl: text("profileImageUrl"),
  email: varchar("email", { length: 320 }).notNull(),
  github: text("github"),
  linkedin: text("linkedin"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioAbout = typeof portfolioAbout.$inferSelect;
export type InsertPortfolioAbout = typeof portfolioAbout.$inferInsert;

export const portfolioExperience = mysqlTable("portfolio_experience", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  description: text("description").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  current: int("current").default(0).notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioExperience = typeof portfolioExperience.$inferSelect;
export type InsertPortfolioExperience = typeof portfolioExperience.$inferInsert;

export const portfolioCertifications = mysqlTable("portfolio_certifications", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  issuer: varchar("issuer", { length: 255 }).notNull(),
  issueDate: timestamp("issueDate").notNull(),
  credentialUrl: text("credentialUrl"),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioCertification = typeof portfolioCertifications.$inferSelect;
export type InsertPortfolioCertification = typeof portfolioCertifications.$inferInsert;

export const portfolioSocial = mysqlTable("portfolio_social", {
  id: int("id").autoincrement().primaryKey(),
  platform: varchar("platform", { length: 100 }).notNull(),
  url: text("url").notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioSocial = typeof portfolioSocial.$inferSelect;
export type InsertPortfolioSocial = typeof portfolioSocial.$inferInsert;

export const portfolioContactMessages = mysqlTable("portfolio_contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  replied: int("replied").default(0).notNull(),
  read: int("read").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioContactMessage = typeof portfolioContactMessages.$inferSelect;
export type InsertPortfolioContactMessage = typeof portfolioContactMessages.$inferInsert;
