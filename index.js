/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /index.js
 * @create:      2021-11-18 15:55:12.122
 * @modify:      2021-11-27 07:09:20.594
 * @version:     1.0.3
 * @times:       23
 * @lines:       51
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const express = require("express");
const { CreateExpressLogger, StartServer, KavenDigestAuthentication } = require("kaven-utils");

const { 
    PORT, UPLOAD_ROOT, ENABLE_LOG, LOG_FILE_PATH, ERROR_FILE_PATH, ENABLE_HTTPS, SSL_CERT_PATH, SSL_KEY_PATH, 
    ENABLE_AUTHENTICATION, AUTH_USER, AUTH_PASS, ALLOW_UPLOAD_TO_SUB_DIR, ALLOW_OVERRIDE_EXISTING_FILE,
    FORM_DATA_FIELD_FILE, FORM_DATA_FIELD_DIR,
} = require("./config");
const { KavenFileServer, KavenFileServerOptions } = require("./server");

const app = express();

if (ENABLE_AUTHENTICATION) {
    const auth = new KavenDigestAuthentication(AUTH_USER, AUTH_PASS);
    app.use(auth.RequestHandler);
}

app.use(CreateExpressLogger());

const options = KavenFileServerOptions();
options.fieldFile = FORM_DATA_FIELD_FILE;
options.fieldDir = FORM_DATA_FIELD_DIR;
options.allowUploadToSubDir = ALLOW_UPLOAD_TO_SUB_DIR;
options.allowOverrideExistingFile = ALLOW_OVERRIDE_EXISTING_FILE;

app.use("/", KavenFileServer(UPLOAD_ROOT, options));

StartServer(app, PORT, {
    enableLog: ENABLE_LOG,
    enableHttps: ENABLE_HTTPS,
    logFile: LOG_FILE_PATH,
    errFile: ERROR_FILE_PATH,
    sslCertFile: SSL_CERT_PATH,
    sslKeyFile: SSL_KEY_PATH,
});
