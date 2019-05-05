import Reading from './Reading';
import Station from './Station';
import Sensor from './Sensor';

const models = {
  Reading,
  Station,
  Sensor,
};

export default async function addModelsToContext(context, { applyValidatorsAndIndexes } = {}) {
  const newContext = Object.assign({}, context);
  const modelNames = Object.keys(models);

  for (const modelName of modelNames) {
    newContext[modelName] = new models[modelName](newContext);

    if (applyValidatorsAndIndexes) {
      // Update the validator
      if (newContext[modelName].updateValidator) {
        await newContext[modelName].updateValidator();
      }

      // Update indexes
      if (newContext[modelName].updateIndexes) {
        await newContext[modelName].updateIndexes();
      }
    }
  }

  return newContext;
}
