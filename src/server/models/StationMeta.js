import regex from './../../modules/regex';

const stationMeta = {
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

    name: { $type: 'string' },
  },
};

export default stationMeta;
