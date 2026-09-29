import { isNull } from 'drizzle-orm';
import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
export const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey(),
  day: text('day').notNull(),
  hour: text('hour').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  cancelToken: text('cancel_token').notNull().unique(),
  createdAt: text('created_at').notNull(),
  cancelledAt: text('cancelled_at'),
}, (table) => [uniqueIndex('idx_bookings_active_slot').on(table.day, table.hour).where(isNull(table.cancelledAt))]);
