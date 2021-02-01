import { exec } from 'child_process';

const toggleWemo = action => {
  const wemoDetails = JSON.parse(action.metaData);
  console.info(`turning ${wemoDetails.name} ${wemoDetails.event}`);
  if (process.env.RUN_LOCAL_ACTIONS === 'false') {
    console.info('dummy wemo action');
    console.info(wemoDetails);
    return;
  }
  exec(`wemo switch ${wemoDetails.name} ${wemoDetails.event}`);
};

export default toggleWemo;
