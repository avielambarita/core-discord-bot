import { Events } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

export default class Ready extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.ClientReady,
            description:
                "Emitted when the client becomes ready to start working.",
            once: true
        });
    }

    Execute(...args: any): void {
        console.log(`Successfully logged in as \`${this.client.user?.tag}\``);
    }
}
