/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /server.js
 * @create:      2021-11-18 15:22:36.251
 * @modify:      2021-11-25 13:22:12.432
 * @version:     1.0.2
 * @times:       27
 * @lines:       122
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const { Router } = require("express");
const fs = require("fs");
const multer = require("multer");
const { FileSize } = require("kaven-utils");
const { join, isAbsolute } = require("path");

/**
 * 
 * @param {string} uploadRootDir 
 * @param {string} filedFile Default `file`
 * @param {string} fieldDir Default `dir`
 * @param {boolean} allowUploadToSubDir Default `true`
 * @returns 
 */
module.exports = function KavenFileServer(uploadRootDir, filedFile = "file", fieldDir = "dir", allowUploadToSubDir = true) {

    if (!uploadRootDir) {
        throw new Error("dir is required.");
    }

    const router = Router();

    // https://github.com/expressjs/multer/issues/914#issuecomment-654084057
    // Note that req.body might not have been fully populated yet.
    // It depends on the order that the client transmits fields and files to the server.
    // Make sure that fields are sent before files.
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            try {
                let saveDir = uploadRootDir;

                if (allowUploadToSubDir) {
                    const fieldName = `${file.fieldname}_dir`;
                    let subDir = req.body[fieldName];
                    if (!subDir) {             
                        if (fieldDir) {                                           
                            subDir = req.body[fieldDir];
                        }
                    }

                    if (subDir && !isAbsolute(subDir)) {
                        saveDir = join(uploadRootDir, subDir);
                    }
                }
            
                if (!fs.existsSync(saveDir)) {
                    fs.mkdirSync(saveDir, { recursive: true });
                    console.log(`mkdir: ${saveDir}`);
                }
            
                cb(null, saveDir);
            } catch (ex) {
                cb(ex);
            }
        },
        filename: function(req, file, cb) {
            try {
                let saveName = file.originalname;

                const fieldName = `${file.fieldname}_name`;
                const name = req.body[fieldName];
                if (name) {
                    saveName = name;
                }
                
                cb(null, saveName);
            } catch (ex) {
                cb(ex);
            }
        },
    });

    const m = multer({
        storage: storage,
    });
    const upload = filedFile ? m.array(filedFile) : m.any();

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

                for (const file of req.files) {
                    console.log(`file uploaded: ${file.path}, ${FileSize(file.size)}`);
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
