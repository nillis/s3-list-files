const async = require('async'),
	AWS = require('aws-sdk'),
	fs = require('fs');
const s3 = new AWS.S3();

const bucket = 'aes.data';

const log = (data, cb) => {
	console.log(JSON.stringify(data, null, '\t'));
	cb(null, data);
}

async.waterfall([
	cb => s3.listObjects({Bucket: bucket}, cb),
	(data, cb) => cb(null, {
		Records: data.Contents.map(x => {
			return {
				s3: {
					bucket: {
						name: bucket
					},
					object: {
						key: x.Key
					}
				}
			};
		})
	}),
	(data, cb) => fs.writeFile('event.json', JSON.stringify(data, null, '\t'), 'utf-8', cb)
]);