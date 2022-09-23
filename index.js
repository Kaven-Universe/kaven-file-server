/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /index.js
 * @create:      2021-11-18 15:55:12.122
 * @modify:      2022-09-23 23:40:02.225
 * @version:     1.0.7
 * @times:       31
 * @lines:       95
 * @copyright:   Copyright © 2021-2022 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const express = require("express");

const {
    LogLevel,
} = require("kaven-basic");

const {
    KavenLogger,
    CreateExpressAuthentication,
    CreateExpressLogger,
    StartServer,
    KavenDigestAuthentication,
    KavenAuthorizationRecords,
    CreateExpress404Handler,
} = require("kaven-utils");

const {
    PORT,
    UPLOAD_ROOT,
    ENABLE_LOG,
    LOG_FILE_PATH,
    ERROR_FILE_PATH,
    ENABLE_HTTPS,
    SSL_CERT_PATH,
    SSL_KEY_PATH,
    ENABLE_AUTHENTICATION,
    AUTH_USER,
    AUTH_PASS,
    ALLOW_UPLOAD_TO_SUB_DIR,
    ALLOW_OVERRIDE_EXISTING_FILE,
    FORM_DATA_FIELD_FILE,
    FORM_DATA_FIELD_DIR,
} = require("./config");

const {
    KavenFileServer,
    KavenFileServerOptions,
} = require("./server");

if (ENABLE_LOG) {
    KavenLogger.Default = new KavenLogger(LOG_FILE_PATH, {
        files: [{
            file: ERROR_FILE_PATH,
            levels: [LogLevel.Warn, LogLevel.Error],
            saveWithAnsiColor: false,
        }],
    });
    KavenLogger.Default.Start();
}

const app = express();

app.set("trust proxy", "loopback, linklocal, uniquelocal");

app.use(CreateExpressLogger());

const options = KavenFileServerOptions();
options.fieldFile = FORM_DATA_FIELD_FILE;
options.fieldDir = FORM_DATA_FIELD_DIR;
options.allowUploadToSubDir = ALLOW_UPLOAD_TO_SUB_DIR;
options.allowOverrideExistingFile = ALLOW_OVERRIDE_EXISTING_FILE;

if (ENABLE_AUTHENTICATION) {
    const authentication = new KavenDigestAuthentication(AUTH_USER, AUTH_PASS);
    authentication.Records = new KavenAuthorizationRecords();

    const { handler } = CreateExpressAuthentication(authentication);

    options.authHandler = handler;
}

app.use("/", KavenFileServer(UPLOAD_ROOT, options));
app.use(CreateExpress404Handler());

StartServer(app, PORT, {
    enableHttps: ENABLE_HTTPS,
    sslCertFile: SSL_CERT_PATH,
    sslKeyFile: SSL_KEY_PATH,
});
