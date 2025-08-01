import { Client, Collection } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import IConfig from "../interfaces/IConfig";
import dotenv from "dotenv";
import Handler from "./Handler";
import Command from "./Command";
import Subcommand from "./Subcommand";

dotenv.config();

export default class CustomClient extends Client implements ICustomClient {
    handlers: Handler;
    config: IConfig;
    commands: Collection<string, Command>;
    subcommands: Collection<string, Subcommand>;
    cooldowns: Collection<string, Collection<string, number>>;
    developmentMode: boolean;

    constructor() {
        super({ intents: [] });

        this.config = {
            application_token: process.env.APPLICATION_TOKEN || "",
            application_id: process.env.APPLICATION_ID || "",
            dev_application_token: process.env.DEV_APPLICATION_TOKEN || "",
            dev_application_id: process.env.DEV_APPLICATION_ID || "",
            dev_guild_id: process.env.DEV_GUILD_ID || ""
        };

        this.handlers = new Handler(this);
        this.commands = new Collection();
        this.subcommands = new Collection();
        this.cooldowns = new Collection();

        this.developmentMode = process.argv.slice(2).includes("--dev");
    }

    Init(): void {
        console.log(
            `Running in \`${
                this.developmentMode ? "development" : "production"
            }\` mode...`
        );

        this.LoadHandler();
        this.login(
            this.developmentMode
                ? this.config.dev_application_token
                : this.config.application_token
        ).catch(error => console.log(error));
    }

    LoadHandler(): void {
        this.handlers.LoadEvents();
        this.handlers.LoadCommands();
    }
}
