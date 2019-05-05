import BaseModel from './BaseModel';
import ReadingMeta from './ReadingMeta';

export default class Reading extends BaseModel {
  validator = ReadingMeta.validator;
  indexes = ReadingMeta.indexes;

  constructor(context, collectionName) {
    super(context, 'reading');
    this.context = context;
    this.collection = context.db.collection('reading');
  }

  async getSensorByStation() {
    return await this.collection
      .aggregate([{ $group: { _id: { name: '$name', station: '$station' } } }])
      .toArray();
  }
}
