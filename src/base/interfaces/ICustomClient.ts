import { Collection } from "discord.js";
import IConfig from "./IConfig";
import Command from "../classes/Command";
import Subcommand from "../classes/Subcommand";

export default interface ICustomClient {
    config: IConfig;
    commands: Collection<string, Command>;
    subcommands: Collection<string, Subcommand>;
    cooldowns: Collection<string, Collection<string, number>>;

    Init(): void;
    LoadHandler(): void;
}
