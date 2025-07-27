import { glob } from "glob";
import path from "path";
import IHandler from "../interfaces/IHandler";
import CustomClient from "./CustomClient";
import Event from "./Event";

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
}
