import { pgTable, text, timestamp, boolean, jsonb, uuid } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    company: text('company').notNull(),
    category: text('category').notNull(),
    imageUrl: text('image_url'),
    year: text('year'),
    description: text('description'),
    link: text('link'),
    videoUrl: text('video_url'),
    videoType: text('video_type'),
    socialLinks: jsonb('social_links'),
    gallery: jsonb('gallery'),
    additionalVideos: jsonb('additional_videos'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const testimonials = pgTable('testimonials', {
    id: uuid('id').defaultRandom().primaryKey(),
    quote: text('quote').notNull(),
    author: text('author').notNull(),
    role: text('role'),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const services = pgTable('services', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    count: text('count'),
    iconType: text('icon_type'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const teamMembers = pgTable('team_members', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    role: text('role').notNull(),
    imageUrl: text('image_url'),
    bgColor: text('bg_color'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const brands = pgTable('brands', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const contactSubmissions = pgTable('contact_submissions', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    website: text('website'),
    message: text('message'),
    submittedAt: timestamp('submitted_at').defaultNow(),
    read: boolean('read').default(false),
});

export const siteSettings = pgTable('site_settings', {
    key: text('key').primaryKey(),
    value: jsonb('value'),
});

export const faqs = pgTable('faqs', {
    id: uuid('id').defaultRandom().primaryKey(),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const blogPosts = pgTable('blog_posts', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    excerpt: text('excerpt'),
    color: text('color'), // hex code
    readTime: text('read_time'),
    content: text('content'), // for full article later
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').defaultNow(),
});
