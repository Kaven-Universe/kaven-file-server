/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /server.js
 * @create:      2021-11-18 15:22:36.251
 * @modify:      2021-11-26 12:27:38.346
 * @version:     1.0.3
 * @times:       32
 * @lines:       145
 * @copyright:   Copyright © 2021 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const { Router } = require("express");
const fs = require("fs");
const multer = require("multer");
const { FileSize, IsString, Distinct } = require("kaven-utils");
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
 
    const tryGetField = (from, name) => {
        if (!from || !name) {
            return undefined;
        }
 
        let result = from[name];
        if (result === undefined) {
            return result;
        }
 
        if (IsString(result)) {
            return result;
        }
 
        if (Array.isArray(result)) {
            result = Distinct(result);
            if (result.length === 1) {
                return result[0];
            }
        }
 
        return undefined;
    };
 
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
                    const subDir = tryGetField(req.body, fieldName) || tryGetField(req.body, fieldDir);
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
                const name = tryGetField(req.body, fieldName);
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
                    return res.status(400).send(err.message);
                }
 
                for (const file of req.files) {
                    let log = `file uploaded: ${file.path}, ${FileSize(file.size)}`;
                    if (file.originalname !== file.filename) {
                        log += `, originalname: ${file.originalname}`;
                    }
                     
                    console.log(log);
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
 