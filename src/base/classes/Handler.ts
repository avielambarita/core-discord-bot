import { glob } from "glob";
import path from "path";
import IHandler from "../interfaces/IHandler";
import CustomClient from "./CustomClient";
import Event from "./Event";
import Command from "./Command";
import Subcommand from "./Subcommand";

export default class Handler implements IHandler {
    client: CustomClient;

    constructor(client: CustomClient) {
        this.client = client;
    }

    async LoadEvents() {
        const files = (await glob("build/events/**/*.js")).map(filePath =>
            path.resolve(filePath)
        );
        files.map(async (file: string) => {
            const event: Event = new (await import(file)).default(this.client);
            if (!event.name) {
                console.warn(`${file.split("/").pop()} does not have name`);
                return delete require.cache[require.resolve(file)];
            }

            const execute = (...args: any) => event.Execute(...args);

            if (event.once) {
                //@ts-ignore
                this.client.once(event.name, execute);
            } else {
                //@ts-ignore
                this.client.on(event.name, execute);
            }

            return delete require.cache[require.resolve(file)];
        });
    }

    async LoadCommands() {
        const files = (await glob("build/commands/**/*.js")).map(filePath =>
            path.resolve(filePath)
        );
        files.map(async (file: string) => {
            const command: Command | Subcommand = new (
                await import(file)
            ).default(this.client);
            if (!command.name) {
                console.warn(`${file.split("/").pop()} does not have name`);
                return delete require.cache[require.resolve(file)];
            }

            if (file.split("/").pop()?.split(".")[2]) {
                return this.client.subcommands.set(command.name, command);
            }

            this.client.commands.set(command.name, command as Command);

            return delete require.cache[require.resolve(file)];
        });
    }
}
