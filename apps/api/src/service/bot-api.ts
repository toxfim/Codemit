import { BotApi } from "@codemit/bot-api";
import configs from "../config";

const { BOT_TOKEN } = configs;

const codemitBot = new BotApi(BOT_TOKEN);

export default codemitBot;
