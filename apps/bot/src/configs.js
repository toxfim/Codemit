import "dotenv/config";
import { getEnv } from "@codemit/shared/utils";
const configs = {
    BOT_TOKEN: getEnv("BOT_TOKEN"),
    API_BASE_URL: getEnv("API_BASE_URL", "http://localhost:4400"),
};
export default configs;
