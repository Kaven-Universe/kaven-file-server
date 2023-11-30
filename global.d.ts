/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /global.d.ts
 * @create:      2023-11-30 14:20:51.381
 * @modify:      2023-11-30 14:28:44.577
 * @version:     1.0.8
 * @times:       2
 * @lines:       39
 * @copyright:   Copyright © 2023 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

export interface AppConfig {
    NODE_ENV: string;
    PORT: number;

    UPLOAD_ROOT: string;

    ENABLE_HTTPS: boolean;
    SSL_KEY_PATH: string;
    SSL_CERT_PATH: string;

    ENABLE_LOG: boolean;
    LOG_FILE_PATH: string;
    ANSI_LOG_FILE_PATH: string;

    ENABLE_AUTHENTICATION: boolean;
    AUTH_USER: string;
    AUTH_PASS: string;

    ALLOW_UPLOAD_TO_SUB_DIR: boolean;
    ALLOW_OVERRIDE_EXISTING_FILE: boolean;

    FORM_DATA_FIELD_FILE: string;
    FORM_DATA_FIELD_DIR: string;
}