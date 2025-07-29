import {
    ChatInputCommandInteraction,
    Collection,
    Events,
    MessageFlags,
    time
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import Command from "../../base/classes/Command";

export default class CommandHandler extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.InteractionCreate,
            description: "Emitted when an interaction is created.",
            once: false
        });
    }

    Execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const command: Command = this.client.commands.get(
            interaction.commandName
        )!;

        if (!command) {
            interaction.reply({
                content:
                    "Impressive. You've discovered a command that doesn't exist. Truly groundbreaking. Try `/help` before we all spiral into chaos.",
                flags: MessageFlags.Ephemeral
            });
            return this.client.commands.delete(interaction.commandName);
        }

        const { cooldowns } = this.client;
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name)!;
        const cooldownAmount = (command.cooldown || 3) * 1_000;

        if (
            timestamps.has(interaction.user.id) &&
            now < (timestamps.get(interaction.user.id) || 0) + cooldownAmount
        ) {
            const timeRemaining = (
                ((timestamps.get(interaction.user.id) || 0) +
                    cooldownAmount -
                    now) /
                1_000
            ).toFixed(1);
            return interaction.reply({
                content: `Whoa there, turbo. Let the dust settle. Try again in \`${timeRemaining} seconds\`, unless you've figured out how to bend time itself.`,
                flags: MessageFlags.Ephemeral
            });
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(
            () => timestamps.delete(interaction.user.id),
            cooldownAmount
        );

        try {
            const subcommandGroup =
                interaction.options.getSubcommandGroup(false);
            const subcommand = `${interaction.commandName}${
                subcommandGroup ? `.${subcommandGroup}` : ""
            }.${interaction.options.getSubcommand(false) || ""}`;

            return (
                this.client.subcommands.get(subcommand)?.Execute(interaction) ||
                command.Execute(interaction)
            );
        } catch (error) {
            console.error(error);
        }
    }
}
