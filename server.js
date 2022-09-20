/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /server.js
 * @create:      2021-11-18 15:22:36.251
 * @modify:      2022-09-20 21:18:24.450
 * @version:     1.0.6
 * @times:       43
 * @lines:       181
 * @copyright:   Copyright © 2021-2022 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

const { existsSync, mkdirSync } = require("fs");
const { join, isAbsolute, normalize } = require("path");
const { Router } = require("express");
const multer = require("multer");
const { FileSize, IsString, Distinct } = require("kaven-basic");
const { KavenLogger } = require("kaven-utils");

function KavenFileServerOptions() {
    return {
        fieldFile: "file",
        fieldDir: "dir",
        allowUploadToSubDir: true,
        allowOverrideExistingFile: true,        
    };
}

/**
 * 
 * @param {string} uploadRootDir 
 */
function KavenFileServer(uploadRootDir, options = KavenFileServerOptions()) {

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

    const map = new Map();

    // https://github.com/expressjs/multer/issues/914#issuecomment-654084057
    // Note that req.body might not have been fully populated yet.
    // It depends on the order that the client transmits fields and files to the server.
    // Make sure that fields are sent before files.
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            try {
                let saveDir = uploadRootDir;

                if (options.allowUploadToSubDir) {
                    const fieldName = `${file.fieldname}_dir`;
                    const subDir = tryGetField(req.body, fieldName) || tryGetField(req.body, options.fieldDir);
                    if (subDir && !isAbsolute(subDir)) {
                        saveDir = join(uploadRootDir, subDir);
                    }
                }

                if (!existsSync(saveDir)) {
                    mkdirSync(saveDir, { recursive: true });
                    console.log(`mkdir: ${saveDir}`);
                }

                map.set(file, saveDir);

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

                const saveDir = map.get(file);
                const filePath = join(saveDir, saveName);

                if (!normalize(filePath).startsWith(uploadRootDir)) {
                    cb(new Error("Cannot save the file outside the root directory."));
                    return;
                }

                if (!options.allowOverrideExistingFile) {                   
                    if (existsSync(filePath)) {
                        cb(new Error("File already exists."));
                        return;
                    }
                }

                cb(null, saveName);
            } catch (ex) {
                cb(ex);
            } finally {
                map.delete(file);
            }
        },
    });

    const m = multer({
        storage: storage,
    });
    const upload = options.fieldFile ? m.array(options.fieldFile) : m.any();

    router.get("/", (req, res) => {
        res.send("<a href='https://github.com/Kaven-Universe/kaven-file-server'>Kaven File Server</a>");
    });

    if (options.authHandler) {
        router.use(options.authHandler);
    }

    router.post("/file", (req, res) => {
        upload(req, res, async function(err) {
            try {
                if (err) {
                    KavenLogger.Default.Error(err);

                    // An error occurred when uploading
                    return res.status(400).send(err.message);
                }

                for (const file of req.files) {
                    let log = `file uploaded: ${file.path}, ${FileSize(file.size)}`;
                    if (file.originalname !== file.filename) {
                        log += `, originalname: ${file.originalname}`;
                    }

                    KavenLogger.Default.Info(log);
                }

                // Everything went fine
                return res.sendStatus(200);
            } catch (ex) {
                KavenLogger.Default.Error(ex);
                return res.sendStatus(400);
            }
        });
    });

    return router;
}

module.exports = {
    KavenFileServerOptions,
    KavenFileServer,
};
