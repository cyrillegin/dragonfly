import AWS from 'aws-sdk';
import fetch from 'node-fetch';
import { Reading } from '../db';

const requestAndUploadImage = async details => {
  console.info('requesting new image');
  // send request to pi
  const result = await fetch(
    `http://${details.station.address}:${details.station.port}/requestImage`,
  );
  // pi takes picture and sends it back to base
  const buffer = await result.buffer();

  // base uploads to S3
  const s3Client = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'us-east-1',
  });

  // get latest number
  const lastImage = await Reading.findOne({
    where: {
      sensorId: details.action.sensorId,
    },
    order: [['created_at', 'DESC']],
  });

  const index = `${lastImage ? lastImage.value + 1 : 0}`.padStart(5, '0');
  const key = `images/${details.station.id}/${details.action.sensorId}/image_${index}.png`;

  const params = {
    Bucket: 'cyrille-dragonfly',
    Key: key,
    Body: buffer,
    ACL: 'public-read',
  };
  s3Client.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    Reading.create({
      value: index,
      timestamp: new Date(),
      sensorId: details.action.sensorId,
      stationId: details.station.id,
    });
    console.info('new image saved to S3');
  });
};

export default requestAndUploadImage;
