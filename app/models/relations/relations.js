
export const relations = defineRelations({ users, roles },
    (r) => { return ({
        users: {
            role: r.one.roles({
            from: r.users.roleId,
            to: r.roles.id,
      }),
    },

    roles: {
      users: r.many.users(),
    },
  })},
);