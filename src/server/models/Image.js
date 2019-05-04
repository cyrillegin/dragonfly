import BaseModel from './BaseModel';
import ImageMeta from './ImageMeta';

export default class Image extends BaseModel {
  validator = ImageMeta.validator;
  indexes = ImageMeta.indexes;

  constructor(context, collectionName) {
    super(context, 'user');
    this.context = context;
    this.collection = context.db.collection('image');
  }

  async allApproved() {
    return await this.collection
      .aggregate([
        {
          // Make sure all images are approved.
          $match: {
            approved: true,
            banned: false,
            removed: { $exists: false },
            state: 'completed',
          },
        },
        {
          // Group by week, week starts on Sundays, ends on Saturdays
          $group: {
            _id: {
              week: {
                $week: '$createdAt',
              },
            },
            // project an arry of image objects
            images: {
              $push: {
                _id: '$_id',
                originalUrl: '$originalUrl',

                fileName: '$fileName',
                title: '$title',
                taken: '$taken',
                camera: '$camera',
                aperture: '$aperture',
                shutterSpeed: '$shutterSpeed',
                iso: '$iso',
                likes: '$likes',
                owner: '$owner',
                prompt: '$prompt',
              },
            },
          },
        },
      ])
      .toArray();
  }

  async imagesAwaitingApproval() {
    return await this.collection
      .find({ approved: false, banned: false, removed: { $exists: false } })
      .toArray();
  }

  async addLike(image, user) {
    return await this.collection.update({ _id: image }, { $push: { likes: user } });
  }

  async myImages(user) {
    return await this.collection
      .find({ owner: user, removed: { $exists: false }, banned: false })
      .toArray();
  }
}
