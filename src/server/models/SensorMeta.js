import regex from './../../modules/regex';

const sensorMeta = {
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
    station: {
      $type: 'string',
      $regex: regex.documentId,
      $options: '',
    },
  },
};

export default sensorMeta;
