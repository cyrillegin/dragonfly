import fetch from 'node-fetch';

const conditionLookup = {
  lt: 'less than',
  lte: 'less than or equal to',
  eq: 'equal to',
  gt: 'greater than',
  gte: 'greater than or equal to',
};
const sendSlack = details => {
  const body = {
    attachments: [
      {
        title: details.sensor.name,
        text: `Sensor is ${conditionLookup[details.action.condition]} ${
          details.action.value
        } and is out of bounds, value is currently ${details.reading.value}`,
        color: '#FF0000',
      },
    ],
  };

  if (process.env.RUN_LOCAL_ACTIONS === 'false') {
    console.info('dummy slack action');
    console.info(body);
    return;
  }

  console.info(body.attachments[0]);

  fetch(process.env.SLACK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

export default sendSlack;
