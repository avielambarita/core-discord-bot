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

        const cliendId = this.client.developmentMode
            ? this.client.config.dev_application_id
            : this.client.config.application_id;
        const rest = new REST().setToken(
            this.client.developmentMode
                ? this.client.config.dev_application_token
                : this.client.config.application_token
        );

        if (!this.client.developmentMode) {
            const globalCommands: any = await rest.put(
                Routes.applicationCommands(cliendId),
                {
                    body: this.getJSON(
                        this.client.commands.filter(
                            command => !command.developer
                        )
                    )
                }
            );

            console.log(
                `Successfully loaded ${globalCommands.length} global commands`
            );
        }

        const developerCommands: any = await rest.put(
            Routes.applicationGuildCommands(
                cliendId,
                this.client.config.dev_guild_id
            ),
            {
                body: this.getJSON(
                    this.client.commands.filter(command => command.developer)
                )
            }
        );

        console.log(
            `Successfully loaded ${developerCommands.length} developer commands`
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
