var AWS = require('aws-sdk');
var async = require("async");

AWS.config.loadFromPath("./aws.config.json");

var s3 = new AWS.S3();
var s3Objects = [];
var bucket = "[CHANGE ME]";

var params = { Bucket: bucket };

function s3ListObjects(params, cb) {
    s3.listObjectsV2(params, function(err, data) {
        if (err) {
            console.log("listS3Objects Error:", err);
        } else {
            var contents = data.Contents;
            s3Objects = s3Objects.concat(contents);
            if (data.IsTruncated) {
                // Set Marker to last returned key
                params.Marker = contents[contents.length - 1].Key;
                s3ListObjects(params, cb);
            } else {
                cb();
            }
        }
    });
}

function encryptObject(s3Object, cb) {
    if (s3Object.Key.endsWith("/")) {
        cb();
        return;
    }
    var params = {
        Bucket: bucket,
        Key: s3Object.Key,
        Range: "bytes=0-0"
    };
    s3.getObject(params, function(err, data) {
        if (err) {
            console.log('Error fetching object ' + s3Object.Key);
            console.log(err, err.stack); // an error occurred
            cb();
        }
        else {
            if (!data.ServerSideEncryption) {
                s3.copyObject({
                    Bucket: bucket,
                    Key: s3Object.Key,
                    CopySource: encodeURIComponent(bucket + '/' + s3Object.Key),
                    MetadataDirective: 'COPY',
                    ServerSideEncryption: 'AES256',
                    StorageClass: 'STANDARD'
                }, function(err, data) {
                    if (err) {
                        console.log('Error updating object ' + s3Object.Key);
                        console.log(err, err.stack); // an error occurred
                        cb();
                    } else {
                        console.log(s3Object.Key + ' updated.');
                        cb();
                    }
                });
            } else {
                console.log(s3Object.Key + " already encrypted.");
                cb();
            }
        }
    });
}

s3ListObjects(params, function() {
    async.eachSeries(s3Objects, encryptObject)
});