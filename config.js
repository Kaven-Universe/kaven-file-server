/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /config.js
 * @create:      2021-11-23 17:30:37.304
 * @modify:      2021-11-23 17:34:39.627
 * @version:     1.0.1
 * @times:       2
 * @lines:       52
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const { LoadEnv, IS_DEV } = require("kaven-utils");

// #region DotNev Config File
const ENV_FILE_PATH = [
    ".env",
    ".env.example",
];

LoadEnv(__dirname, ...ENV_FILE_PATH);
// #endregion

const IS_DEBUG = IS_DEV();

const PORT = Number(process.env.PORT);

const ENABLE_HTTPS = process.env.ENABLE_HTTPS !== "false";
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

const ENABLE_LOG = process.env.ENABLE_LOG !== "false";
const LOG_FILE_PATH = process.env.LOG_FILE_PATH;
const ERROR_FILE_PATH = process.env.ERROR_FILE_PATH;

module.exports = {
    IS_DEBUG,

    PORT,

    ENABLE_HTTPS,
    SSL_KEY_PATH,
    SSL_CERT_PATH,

    ENABLE_LOG,
    LOG_FILE_PATH,
    ERROR_FILE_PATH,
};
