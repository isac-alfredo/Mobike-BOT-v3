const fs = require('fs');
const path = require('path');

function loadCommands() {

    const commands = new Map();

    const commandsPath =
        path.join(__dirname, '..', 'commands');

    if (!fs.existsSync(commandsPath)) {
        return commands;
    }

    const files =
        fs.readdirSync(commandsPath)
            .filter(file => file.endsWith('.js'));

    for (const file of files) {

        try {

            const command =
                require(path.join(commandsPath, file));

            if (
                command &&
                command.name &&
                typeof command.execute === 'function'
            ) {

                commands.set(
                    command.name.toLowerCase(),
                    command
                );

            }

        } catch (error) {

            console.error(
                `Erro ao carregar ${file}:`,
                error
            );

        }

    }

    console.log(
        `📦 ${commands.size} comandos carregados.`
    );

    return commands;
}

module.exports = {
    loadCommands
};