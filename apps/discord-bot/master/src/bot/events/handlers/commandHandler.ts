import { logger } from "apps/discord-bot/master/src/configuration/logger";
import { Client, CommandInteraction } from "discord.js";
import { commandList } from "../../commands/commandList";

export async function handleCommand(client: Client, interaction: CommandInteraction): Promise<void> {
    const command = commandList.find((c) => c.name === interaction.command.name);
    if (!command) {
        logger.warn(`${interaction.guild.name}: Command not found: ${command.name}`);
        return;
    };
    try {
        logger.info(`${interaction.guild.name}: Running command: ${command.name}`);
        await command.run(client, interaction);
    } catch (error) {
        logger.error(error);
        interaction.followUp({ content: `An error has occurred while running command ${command.name}` });
    }
}
