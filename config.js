/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /config.js
 * @create:      2021-11-23 17:30:37.304
 * @modify:      2021-11-26 21:45:32.377
 * @version:     1.0.3
 * @times:       15
 * @lines:       78
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const { isAbsolute, join } = require("path");
const { LoadEnv, IS_DEV } = require("kaven-utils");

// #region DotNev Config File
const ENV_FILE_PATH = [
    "./env/.env",
    "./env/.env.example",
];

LoadEnv(__dirname, ...ENV_FILE_PATH);
// #endregion

const IS_DEBUG = IS_DEV();

const PORT = Number(process.env.PORT);
const UPLOAD_ROOT = isAbsolute(process.env.UPLOAD_ROOT) ? process.env.UPLOAD_ROOT : join(__dirname, process.env.UPLOAD_ROOT);

const ENABLE_HTTPS = process.env.ENABLE_HTTPS !== "false";
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

const ENABLE_LOG = process.env.ENABLE_LOG !== "false";
const LOG_FILE_PATH = process.env.LOG_FILE_PATH;
const ERROR_FILE_PATH = process.env.ERROR_FILE_PATH;

const ENABLE_AUTHENTICATION = process.env.ENABLE_AUTHENTICATION !== "false";
const AUTH_USER = process.env.AUTH_USER;
const AUTH_PASS = process.env.AUTH_PASS;

const ALLOW_UPLOAD_TO_SUB_DIR = process.env.ALLOW_UPLOAD_TO_SUB_DIR === "true";
const ALLOW_OVERRIDE_EXISTING_FILE = process.env.ALLOW_OVERRIDE_EXISTING_FILE === "true";

const FORM_DATA_FIELD_FILE = process.env.FORM_DATA_FIELD_FILE;
const FORM_DATA_FIELD_DIR = process.env.FORM_DATA_FIELD_DIR;

module.exports = {
    IS_DEBUG,

    PORT,
    UPLOAD_ROOT,

    ENABLE_HTTPS,
    SSL_KEY_PATH,
    SSL_CERT_PATH,

    ENABLE_LOG,
    LOG_FILE_PATH,
    ERROR_FILE_PATH,

    ENABLE_AUTHENTICATION,
    AUTH_USER,
    AUTH_PASS,

    ALLOW_UPLOAD_TO_SUB_DIR,
    ALLOW_OVERRIDE_EXISTING_FILE,
    
    FORM_DATA_FIELD_FILE,
    FORM_DATA_FIELD_DIR,
};

if (IS_DEBUG) {
    console.log(JSON.stringify(module.exports, undefined, 2));
}