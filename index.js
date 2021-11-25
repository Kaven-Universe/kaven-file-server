/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /index.js
 * @create:      2021-11-18 15:55:12.122
 * @modify:      2021-11-25 10:44:19.029
 * @version:     1.0.2
 * @times:       14
 * @lines:       43
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const express = require("express");
const { CreateExpressLogger, StartServer, CreateCertificate, SaveStringToFile, KavenDigestAuthentication } = require("kaven-utils");

const { 
    PORT, UPLOAD_ROOT, ENABLE_LOG, LOG_FILE_PATH, ERROR_FILE_PATH, ENABLE_HTTPS, SSL_CERT_PATH, SSL_KEY_PATH, 
    ENABLE_AUTHENTICATION, AUTH_USER, AUTH_PASS, FORM_DATA_FIELD_NAME,
} = require("./config");
const server = require("./server");

const app = express();

if (ENABLE_AUTHENTICATION) {
    const auth = new KavenDigestAuthentication(AUTH_USER, AUTH_PASS);
    app.use(auth.RequestHandler);
}

app.use(CreateExpressLogger());
app.use("/", server(UPLOAD_ROOT, FORM_DATA_FIELD_NAME));

StartServer(app, PORT, {
    enableLog: ENABLE_LOG,
    enableHttps: ENABLE_HTTPS,
    logFile: LOG_FILE_PATH,
    errFile: ERROR_FILE_PATH,
    sslCertFile: SSL_CERT_PATH,
    sslKeyFile: SSL_KEY_PATH,
});
