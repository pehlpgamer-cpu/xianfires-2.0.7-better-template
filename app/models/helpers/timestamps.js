import { timestamp } from 'drizzle-orm/mysql-core';

export default {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}