import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { sendContactEmail } from "./_core/email";

// Email helper function
async function notifyOwner(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
  try {
    await sendContactEmail(data);
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  portfolio: router({
    // Public endpoints
    getAbout: publicProcedure.query(() => db.getPortfolioAbout()),
    getProjects: publicProcedure.query(() => db.getPortfolioProjects()),
    getSkills: publicProcedure.query(() => db.getPortfolioSkills()),
    getExperience: publicProcedure.query(() => db.getPortfolioExperience()),
    getCertifications: publicProcedure.query(() => db.getPortfolioCertifications()),
    getSocial: publicProcedure.query(() => db.getPortfolioSocial()),

    // Admin-only endpoints
    updateAbout: protectedProcedure
      .input(z.object({
        bio: z.string().optional(),
        education: z.string().optional(),
        interests: z.array(z.string()).optional(),
        profileImageUrl: z.string().optional(),
        email: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return db.updatePortfolioAbout(input);
      }),

    createProject: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string(),
        technologies: z.array(z.string()),
        imageUrl: z.string().optional(),
        projectUrl: z.string().optional(),
        githubUrl: z.string().optional(),
        featured: z.number().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return db.createPortfolioProject(input);
      }),

    updateProject: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        technologies: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        projectUrl: z.string().optional(),
        githubUrl: z.string().optional(),
        featured: z.number().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        const { id, ...data } = input;
        return db.updatePortfolioProject(id, data);
      }),

    deleteProject: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return db.deletePortfolioProject(input.id);
      }),

    updateSkills: protectedProcedure
      .input(z.array(z.object({
        category: z.string(),
        skills: z.array(z.string()),
        order: z.number().optional(),
      })))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return db.updatePortfolioSkills(input);
      }),

    createExperience: protectedProcedure
      .input(z.object({
        title: z.string(),
        company: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date().optional(),
        current: z.number().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return db.createPortfolioExperience(input);
      }),

    updateExperience: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        company: z.string().optional(),
        description: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        current: z.number().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        const { id, ...data } = input;
        return db.updatePortfolioExperience(id, data);
      }),

    deleteExperience: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return db.deletePortfolioExperience(input.id);
      }),

    createCertification: protectedProcedure
      .input(z.object({
        name: z.string(),
        issuer: z.string(),
        issueDate: z.date(),
        credentialUrl: z.string().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return db.createPortfolioCertification(input);
      }),

    updateCertification: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        issuer: z.string().optional(),
        issueDate: z.date().optional(),
        credentialUrl: z.string().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        const { id, ...data } = input;
        return db.updatePortfolioCertification(id, data);
      }),

    deleteCertification: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return db.deletePortfolioCertification(input.id);
      }),

    createSocial: protectedProcedure
      .input(z.object({
        platform: z.string(),
        url: z.string(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return db.createPortfolioSocial(input);
      }),

    updateSocial: protectedProcedure
      .input(z.object({
        id: z.number(),
        platform: z.string().optional(),
        url: z.string().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        const { id, ...data } = input;
        return db.updatePortfolioSocial(id, data);
      }),

    deleteSocial: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return db.deletePortfolioSocial(input.id);
      }),

    submitContactMessage: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().min(5),
        message: z.string().min(10),
      }))
      .mutation(async ({ input }) => {
        const result = await db.createContactMessage(input);
        // Send email notification to owner
        await notifyOwner(input);
        return result;
      }),

    getContactMessages: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return db.getContactMessages();
      }),

    markMessageAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') throw new Error('Unauthorized');
        return db.markMessageAsRead(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
