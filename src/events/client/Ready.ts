import { Collection, Events, REST, Routes } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import Command from "../../base/classes/Command";

export default class Ready extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.ClientReady,
            description:
                "Emitted when the client becomes ready to start working.",
            once: true
        });
    }

    async Execute(...args: any) {
        console.log(`Successfully logged in as \`${this.client.user?.tag}\``);

        const commands: object[] = this.getJSON(this.client.commands);

        const rest = new REST().setToken(this.client.config.application_token);
        const setCommands: any = await rest.put(
            Routes.applicationGuildCommands(
                this.client.config.application_id,
                this.client.config.guild_id
            ),
            { body: commands }
        );

        console.log(
            `Successfully set ${setCommands.length} local guild commands`
        );
    }

    private getJSON(commands: Collection<string, Command>): object[] {
        const data: object[] = [];
        commands.forEach(command => {
            data.push({
                name: command.name,
                description: command.description,
                options: command.options,
                default_member_permissions:
                    command.default_member_permissions.toString(),
                dm_permission: command.dm_permission
            });
        });

        return data;
    }
}
