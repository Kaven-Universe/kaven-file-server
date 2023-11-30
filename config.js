/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /config.js
 * @create:      2021-11-23 17:30:37.304
 * @modify:      2023-11-30 14:28:44.575
 * @version:     1.0.8
 * @times:       19
 * @lines:       61
 * @copyright:   Copyright © 2021-2023 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import { LogLevel, Strings_Development } from "kaven-basic";
import { AppendPathToDirectory, KavenLogger, LoadJsonConfig } from "kaven-utils";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @type { import("./global").AppConfig }
 */
const config = await LoadJsonConfig(__dirname);

if (config === undefined) {
    throw new Error("Config load failed!!!");
}

config.UPLOAD_ROOT = AppendPathToDirectory(__dirname, config.UPLOAD_ROOT);

const Config = {
    ...config,
    RootDir: __dirname,
    IsDevelopment: config.NODE_ENV === Strings_Development,
};

if (!Config.IsDevelopment && Config.ENABLE_LOG) {
    KavenLogger.Default = new KavenLogger({
        files: [
            {
                file: Config.LOG_FILE_PATH,
                levels: [LogLevel.Info, LogLevel.Warn, LogLevel.Error],
                saveWithAnsiColor: false,
            },
            {
                file: Config.ANSI_LOG_FILE_PATH,
                levels: [LogLevel.Info, LogLevel.Warn, LogLevel.Error],
                saveWithAnsiColor: true,
            },
        ],
    });

    KavenLogger.Default.Start();
}

export default Config;
