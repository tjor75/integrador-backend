import { createUpdateSql } from "./src/helpers/updater-helper.js";

const i = createUpdateSql("events", ["test", "ttt"], ["id", "id_creator_user"])

console.log(i)