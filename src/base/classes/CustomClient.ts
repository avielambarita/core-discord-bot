import { Client } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import IConfig from "../interfaces/IConfig";
import dotenv from "dotenv";
import Handler from "./Handler";

dotenv.config();

export default class CustomClient extends Client implements ICustomClient {
    handlers: Handler;
    config: IConfig;

    constructor() {
        super({ intents: [] });

        this.config = {
            application_token: process.env.APPLICATION_TOKEN || ""
        };
        this.handlers = new Handler(this);
    }

    Init(): void {
        this.LoadHandler();
        this.login(this.config.application_token).catch(error =>
            console.log(error)
        );
    }

    LoadHandler(): void {
        this.handlers.LoadEvents();
    }
}
