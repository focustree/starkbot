import { Client, CommandInteraction } from "discord.js";
import { commandList } from "../../commands/commandList";

export async function handleCommand(client: Client, interaction: CommandInteraction): Promise<void> {
    const command = commandList.find((c) => c.name === interaction.command.name);
    if (!command) {
        console.log(`Nom command found for "${command.name}"`);
        return;
    };

    try {
        console.log(`Running command: ${command.name}`);
        await command.run(client, interaction);
    } catch (error) {
        console.error(error);
        interaction.followUp({
            content: `An error has occurred while running command ${command.name}`,
        });
    }
}