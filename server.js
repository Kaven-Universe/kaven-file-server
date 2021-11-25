/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /server.js
 * @create:      2021-11-18 15:22:36.251
 * @modify:      2021-11-25 10:34:06.931
 * @version:     1.0.2
 * @times:       19
 * @lines:       89
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const { Router } = require("express");
const fs = require("fs");
const multer = require("multer");
const { FileSize } = require("kaven-utils");

/**
 * 
 * @param {string} dir 
 * @param {string} filedName 
 * @returns 
 */
module.exports = function KavenFileServer(dir, filedName) {

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
            cb(null, name);
        },
    });

    const m = multer({
        storage: storage,
    });
    const upload = filedName ? m.array(filedName) : m.any();

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

                for (const file of req.files) {
                    console.log(`file uploaded: ${file.filename}, ${FileSize(file.size)}`);
                }

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
