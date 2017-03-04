'use strict';

module.exports = grunt => {
  let AWS = require('aws-sdk')
    , mime = require('mime')
    , fs = require('fs')
    , s3 = new AWS.S3();
  class Upload {
    run() {
      let options = this.options();
      let done = this.async();
      let index = 0;
      grunt.log.debug("options: " + JSON.stringify(options));
      grunt.log.debug("files: " + JSON.stringify(this.files));
      this.files.forEach(file => {
        file.src.filter(src => fs.statSync(src).isFile()).forEach(src => {
          index++;
          let params = {
            Bucket: options.bucket,
            Key: src.replace(/^build\//, file.dest || ""),
            Body: fs.createReadStream(src),
            ContentType: mime.lookup(src)
          };
          s3.putObject(params, (error, data) => {
            index--;
            if (error) grunt.log.error(error);
            else grunt.log.ok("Uploaded " + src + " to " + options.bucket + ": " + params.Key);
            if (index == 0) {
              grunt.log.ok("Upload completed.");
              done();
            }
          });
        });
      });
    }
  }

  grunt.registerMultiTask("upload", "Upload sources to bucket", new Upload().run);
};
