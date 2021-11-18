/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /server.js
 * @create:      2021-11-18 15:22:36.251
 * @modify:      2021-11-18 16:31:17.268
 * @version:     1.0.1
 * @times:       14
 * @lines:       81
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const { Router } = require("express");
const fs = require("fs");
const multer = require("multer");

module.exports = function KavenFileServer(dir, filedName = "file") {

    if (!dir) {
        throw new Error("dir is required.");
    }

    const router = Router();

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`mkdir: ${dir}`);
            }
            cb(null, dir);
        },
        filename: function(req, file, cb) {
            const name = file.originalname;
            // console.log(`filename: ${name}`);
            cb(null, name);
        },
    });

    const upload = multer({
        storage: storage,
        // dest: path.join(__dirname, 'uploads')
    }).single(filedName);

    router.get("/", (req, res) => {
        res.send("Kaven File Server");
    });

    router.post("/file", (req, res) => {
        upload(req, res, async function(err) {
            try {
                if (err) {
                    console.error(err);

                    // An error occurred when uploading
                    return res.sendStatus(400);
                }

                // https://github.com/expressjs/multer/issues/914#issuecomment-654084057
                // Note that req.body might not have been fully populated yet.
                // It depends on the order that the client transmits fields and files to the server.
                // Make sure that fields are sent before files.
                //const { type, description } = req.body;

                console.log(`file uploaded: ${req.file?.path}`);

                // Everything went fine
                return res.sendStatus(200);
            } catch (ex) {
                console.error(ex);
                return res.sendStatus(400);
            }
        });
    });

    return router;
};
