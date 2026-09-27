import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	users: {
		role: r.one.roles({
			from: r.users.roleId,
			to: r.roles.id
		}),
	},
	roles: {
		users: r.many.users(),
	},
}))