/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /index.js
 * @create:      2021-11-18 15:55:12.122
 * @modify:      2023-11-30 14:34:19.510
 * @version:     1.0.8
 * @times:       36
 * @lines:       50
 * @copyright:   Copyright © 2021-2023 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import express from "express";
import { CreateExpress404Handler, CreateExpressAuthentication, CreateExpressLogger, KavenAuthorizationRecords, KavenDigestAuthentication, StartServer } from "kaven-utils";
import Config from "./config.js";
import { KavenFileServer, KavenFileServerOptions } from "./server.js";

const app = express();

app.set("trust proxy", "loopback, linklocal, uniquelocal");

app.use(CreateExpressLogger());

const options = KavenFileServerOptions();
options.fieldFile = Config.FORM_DATA_FIELD_FILE;
options.fieldDir = Config.FORM_DATA_FIELD_DIR;
options.allowUploadToSubDir = Config.ALLOW_UPLOAD_TO_SUB_DIR;
options.allowOverrideExistingFile = Config.ALLOW_OVERRIDE_EXISTING_FILE;

if (Config.ENABLE_AUTHENTICATION) {
    const authentication = new KavenDigestAuthentication(Config.AUTH_USER, Config.AUTH_PASS);
    authentication.Records = new KavenAuthorizationRecords();

    const { handler } = CreateExpressAuthentication(authentication);
    options.authHandler = handler;
}

app.use("/", KavenFileServer(Config.UPLOAD_ROOT, options));
app.use(CreateExpress404Handler());

StartServer(app, Config.PORT, {
    mode: Config.NODE_ENV,
    enableHttps: Config.ENABLE_HTTPS,
    sslCertFile: Config.SSL_CERT_PATH,
    sslKeyFile: Config.SSL_KEY_PATH,
});
