"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// dotenv config
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
const dotenv_1 = __importDefault(require("dotenv"));
const myEnv = dotenv_1.default.config();
dotenv_expand_1.default.expand(myEnv);
const db_config_1 = __importDefault(require("./config/db.config"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
db_config_1.default.sync({ force: true }).then(() => {
    console.log('Database & tables created!');
}).catch((err) => {
    console.log(err);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
