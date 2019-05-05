export default class BaseModel {
  validator = {};
  indexes = [];

  constructor(context, collectionName) {
    this.context = context;
    this.collection = context.db.collection(collectionName);
  }

  async updateValidator() {
    const collectionName = this.collection.collectionName;
    // Ensure the collection exists before trying to update the document validator
    await this.context.db.createCollection(collectionName);
    await this.context.db.command({ collMod: collectionName, validator: this.validator });
  }

  async updateIndexes() {
    if (!this.indexes.length) {
      return;
    }
    await this.collection.createIndexes(this.indexes);
  }

  async insert(doc) {
    return await this.collection.insertOne(doc);
  }

  async all() {
    return await this.collection.find().toArray();
  }

  async find(queryObject) {
    return await this.collection.find(queryObject).toArray();
  }

  async findOneById(id) {
    return await this.collection.findOne({ _id: id });
  }

  async findManyByIds(ids) {
    return await this.collection.find({ _id: { $in: ids } }).toArray();
  }

  async updateOneById(id, mutation) {
    return await this.collection.updateOne({ _id: id }, { $set: mutation });
  }

  // https://stackoverflow.com/questions/35846474/how-to-perform-a-bulk-update-of-documents-in-mongodb-with-java
  async updateMany(bulkOperation) {
    return await this.collection.bulkWrite(bulkOperation);
  }

  async removeOne(id) {
    return await this.collection.remove({ _id: id }, true);
  }

  async querySorted(query, sortObject) {
    return await this.collection
      .find(query)
      .sort(sortObject)
      .toArray();
  }
}
