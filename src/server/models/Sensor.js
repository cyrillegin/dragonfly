import BaseModel from './BaseModel';
import SensorMeta from './SensorMeta';

export default class Sensor extends BaseModel {
  validator = SensorMeta.validator;
  indexes = SensorMeta.indexes;

  constructor(context, collectionName) {
    super(context, 'sensor');
    this.context = context;
    this.collection = context.db.collection('sensor');
  }
}
