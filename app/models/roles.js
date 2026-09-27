import * as t from "drizzle-orm/mysql-core";
import { defineRelationsPart } from "drizzle-orm";

import timestamps from "./helpers/timestamps.js";
import { users } from "./users.js";

export const roles = t.mysqlTable("roles", {
  id: t.int().primaryKey().autoincrement(),

  role: t.varchar({ length: 64 }).notNull(),

  ...timestamps,
});

// export const rolesRelations = defineRelationsPart({ users, roles }, (r) => { return ({
//     roles: {
//       users: r.many.users(),
//     },
//   })
// });