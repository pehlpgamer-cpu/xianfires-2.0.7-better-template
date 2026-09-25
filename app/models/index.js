
import Role from "./Role.js";
import User from "./User.js";

const models = {
    Role,
    User,
};

for (const model of Object.values(models)) {
    if (typeof model.associate === "function") {
        model.associate(models);
    }
}

export default models;