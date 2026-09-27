import * as t from "drizzle-orm/mysql-core";
import { defineRelationsPart } from "drizzle-orm";

import timestamps from "./helpers/timestamps.js";
import { roles } from "./roles.js";

export const users = t.mysqlTable("users", {
  id: t.int().primaryKey().autoincrement(),

  username: t.varchar({ length: 255 }).notNull(),
  email: t.varchar({ length: 255 }).notNull().unique(),

  password: t.varchar({ length: 255 }).notNull(),
  salt: t.varchar({ length: 255 }).notNull(),

  ...timestamps,

  roleId: t
    .int("role_id")
    .notNull()
    .references(() => {return roles.id}),
});

// export const usersRelations = defineRelationsPart({ users, roles }, (r) => { return ({
//     users: {
//       role: r.one.roles({
//         from: r.users.roleId,
//         to: r.roles.id,
//       }),
//     },
//   })},
// );