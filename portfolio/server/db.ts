import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, portfolioAbout, InsertPortfolioAbout, portfolioProjects, InsertPortfolioProject, portfolioSkills, InsertPortfolioSkill, portfolioExperience, InsertPortfolioExperience, portfolioCertifications, InsertPortfolioCertification, portfolioSocial, InsertPortfolioSocial, portfolioContactMessages, InsertPortfolioContactMessage } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Portfolio queries
export async function getPortfolioAbout() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(portfolioAbout).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePortfolioAbout(data: Partial<InsertPortfolioAbout>) {
  const db = await getDb();
  if (!db) return undefined;
  const existing = await getPortfolioAbout();
  if (existing) {
    return await db.update(portfolioAbout).set(data).where(eq(portfolioAbout.id, existing.id));
  } else {
    return await db.insert(portfolioAbout).values(data as InsertPortfolioAbout);
  }
}

export async function getPortfolioProjects() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(portfolioProjects).orderBy(portfolioProjects.order);
}

export async function createPortfolioProject(data: InsertPortfolioProject) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(portfolioProjects).values(data);
}

export async function updatePortfolioProject(id: number, data: Partial<InsertPortfolioProject>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(portfolioProjects).set(data).where(eq(portfolioProjects.id, id));
}

export async function deletePortfolioProject(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
}

export async function getPortfolioSkills() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(portfolioSkills).orderBy(portfolioSkills.order);
}

export async function updatePortfolioSkills(data: InsertPortfolioSkill[]) {
  const db = await getDb();
  if (!db) return undefined;
  // Delete all existing skills and insert new ones
  await db.delete(portfolioSkills);
  if (data.length > 0) {
    return await db.insert(portfolioSkills).values(data);
  }
}

export async function getPortfolioExperience() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(portfolioExperience).orderBy(portfolioExperience.order);
}

export async function createPortfolioExperience(data: InsertPortfolioExperience) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(portfolioExperience).values(data);
}

export async function updatePortfolioExperience(id: number, data: Partial<InsertPortfolioExperience>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(portfolioExperience).set(data).where(eq(portfolioExperience.id, id));
}

export async function deletePortfolioExperience(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(portfolioExperience).where(eq(portfolioExperience.id, id));
}

export async function getPortfolioCertifications() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(portfolioCertifications).orderBy(portfolioCertifications.order);
}

export async function createPortfolioCertification(data: InsertPortfolioCertification) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(portfolioCertifications).values(data);
}

export async function updatePortfolioCertification(id: number, data: Partial<InsertPortfolioCertification>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(portfolioCertifications).set(data).where(eq(portfolioCertifications.id, id));
}

export async function deletePortfolioCertification(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(portfolioCertifications).where(eq(portfolioCertifications.id, id));
}

export async function getPortfolioSocial() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(portfolioSocial).orderBy(portfolioSocial.order);
}

export async function createPortfolioSocial(data: InsertPortfolioSocial) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(portfolioSocial).values(data);
}

export async function updatePortfolioSocial(id: number, data: Partial<InsertPortfolioSocial>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(portfolioSocial).set(data).where(eq(portfolioSocial.id, id));
}

export async function deletePortfolioSocial(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.delete(portfolioSocial).where(eq(portfolioSocial.id, id));
}

export async function createContactMessage(data: InsertPortfolioContactMessage) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.insert(portfolioContactMessages).values(data);
}

export async function getContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(portfolioContactMessages).orderBy(portfolioContactMessages.createdAt);
}

export async function markMessageAsRead(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(portfolioContactMessages).set({ read: 1 }).where(eq(portfolioContactMessages.id, id));
}
