import {
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionsBitField
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Ping extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "ping",
            description: "Checks the bot's latency to Discord servers.",
            category: Category.Utilities,
            default_member_permissions:
                PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            cooldown: 3,
            options: [],
            developer: false
        });
    }

    Execute(interaction: ChatInputCommandInteraction): void {
        interaction.reply({
            content: `Pong. Latency is \`${
                Date.now() - interaction.createdTimestamp
            }ms\`.\nFaster than your last reply in the group chat.`,
            flags: MessageFlags.Ephemeral
        });
    }
}
