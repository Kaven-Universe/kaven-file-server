/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /index.js
 * @create:      2021-11-18 15:55:12.122
 * @modify:      2021-11-18 16:32:12.690
 * @version:     1.0.1
 * @times:       6
 * @lines:       27
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const { join } = require("path");
const express = require("express");

const port = 3000;
const app = express();

app.use("/", require("./server")(join(__dirname, "uploads")));

app.listen(3000, "0.0.0.0", () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
