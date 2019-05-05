import regex from './../../modules/regex';

const readingMeta = {
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

    sensor: {
      $type: 'string',
      $regex: regex.documentId,
      $options: '',
    },
    timestamp: { $type: 'date' },

    $and: [
      {
        $or: [
          {
            value: { $type: 'double' },
          },
          {
            value: { $type: 'int' },
          },
        ],
      },
    ],
  },
};

export default readingMeta;
