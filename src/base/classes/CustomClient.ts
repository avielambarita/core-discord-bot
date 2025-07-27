import { Client } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import IConfig from "../interfaces/IConfig";
import dotenv from "dotenv";

dotenv.config();

export default class CustomClient extends Client implements ICustomClient {
    config: IConfig;

    constructor() {
        super({ intents: [] });
        this.config = {
            application_token: process.env.APPLICATION_TOKEN || ""
        };
    }

    Init(): void {
        this.login(this.config.application_token)
            .then(() => console.log("Successfully logged in!"))
            .catch(error => console.log(error));
    }
}
