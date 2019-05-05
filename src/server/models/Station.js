import BaseModel from './BaseModel';
import StationMeta from './StationMeta';

export default class Station extends BaseModel {
  validator = StationMeta.validator;
  indexes = StationMeta.indexes;

  constructor(context, collectionName) {
    super(context, 'station');
    this.context = context;
    this.collection = context.db.collection('station');
  }
}
