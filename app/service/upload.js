/*
 * @Author: 姜彦汐
 * @Date: 2023-12-22 20:01:21
 * @LastEditors: 姜彦汐
 * @LastEditTime: 2023-12-23 21:59:40
 * @Description:
 * @Site: https://www.undsky.com
 */
const Service = require("egg").Service;
const streamWormhole = require("stream-wormhole");
const path = require("path");
const fs = require("fs-extra");

class UploadService extends Service {
  async stream() {
    const { app, ctx, service } = this;

    const stream = await ctx.getFileStream();
    try {
      const filename = ctx.helper.uuidWithTS() + path.extname(stream.filename);
      await _saveAsFile(stream, path.join(app.config.uploadAbsPath, filename));
      ctx.body = {
        filename: stream.filename,
        mimeType: stream.mimeType,
        url: path.join(app.config.uploadRelPath, filename),
      };
    } catch (error) {
      await streamWormhole(stream);
      throw error;
    }
  }
}

function _saveAsFile(stream, filePath) {
  return new Promise(function (resolve, reject) {
    const writer = fs.createWriteStream(filePath);
    stream
      .pipe(writer)
      .on("error", (error) => {
        writer.destroy();
        stream.destroy();
        reject(error);
      })
      .on("finish", () => {
        writer.destroy();
        stream.destroy();
        resolve();
      });
  });
}

module.exports = UploadService;
