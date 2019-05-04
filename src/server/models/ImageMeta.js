import regex from './../../modules/regex';

const imageMeta = {
  indexes: [
    {
      key: { _id: 1 },
    },
  ],
  validator: {
    _id: {
      $type: 'string',
      $regex: regex.documentId,
      $options: '',
    },
    createdAt: { $type: 'date' },
    updatedAt: { $type: 'date' },

    owner: {
      $type: 'string',
      $regex: regex.documentId,
      $options: '',
    },
    state: { $in: ['uploading', 'uploaded', 'processing', 'retrying', 'failed', 'completed'] },
    originalUrl: { $type: 'string' },
    prompt: {
      $type: 'string',
      $regex: regex.documentId,
      $options: '',
    },
    fileName: { $type: 'string' },
    title: { $type: 'string' },
    approved: { $type: 'bool' },
    banned: { $type: 'bool' },

    // optional fields
    $and: [
      {
        $or: [
          { likes: { $exists: false } },
          { likes: { $size: 0 } },
          {
            likes: {
              $elemMatch: { $exists: true },
              $not: { $elemMatch: { $not: regex.documentId } },
            },
          },
        ],
      },
      {
        $or: [{ removed: { $exists: false } }, { removed: { $type: 'bool' } }],
      },
      {
        $or: [{ taken: { $exists: false } }, { taken: { $type: 'date' } }],
      },
      {
        $or: [{ camera: { $exists: false } }, { camera: { $type: 'string' } }],
      },
      {
        $or: [{ aperture: { $exists: false } }, { aperture: { $type: 'double' } }],
      },
      {
        $or: [{ shutterSpeed: { $exists: false } }, { shutterSpeed: { $type: 'string' } }],
      },
      {
        $or: [{ iso: { $exists: false } }, { iso: { $type: 'int' } }],
      },
      // {
      //   $or: [
      //     { metadata: { $exists: false } },
      //     { metadata: { $size: 0 } },
      //     {
      //       metadata: {
      //         $elemMatch: { $exists: true },
      //         $not: { $elemMatch: { $not: { $type: 'string' } } },
      //       },
      //     },
      //   ],
      // },
    ],
  },
};

export default imageMeta;
