import Image from './Image';

const models = {
  Image,
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
