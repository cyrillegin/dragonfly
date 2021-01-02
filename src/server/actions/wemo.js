import { exec } from 'child_process';

const toggleWemo = action => {
  const wemoDetails = JSON.parse(action.metaData);
  exec(`wemo switch ${wemoDetails.name} ${wemoDetails.event}`);
};

export default toggleWemo;
