module.exports = {
  up: async (queryInterface, Sequelize) =>
    Promise.all([
      // Actions
      queryInterface.renameColumn('actions', 'stationId', 'station_id'),
      queryInterface.renameColumn('actions', 'sensorId', 'sensor_id'),
      queryInterface.renameColumn('actions', 'metaData', 'metadata'),
      queryInterface.renameColumn('actions', 'createdAt', 'created_at'),
      queryInterface.renameColumn('actions', 'updatedAt', 'updated_at'),
      // Dashboards
      queryInterface.renameColumn('dashboards', 'createdAt', 'created_at'),
      queryInterface.renameColumn('dashboards', 'updatedAt', 'updated_at'),
      // Reading
      queryInterface.renameColumn('readings', 'sensorId', 'sensor_id'),
      queryInterface.renameColumn('readings', 'stationId', 'station_id'),
      queryInterface.renameColumn('readings', 'createdAt', 'created_at'),
      queryInterface.renameColumn('readings', 'updatedAt', 'updated_at'),
      // Sensor
      queryInterface.renameColumn('sensors', 'stationId', 'station_id'),
      queryInterface.renameColumn('sensors', 'hardwareName', 'hardware_name'),
      queryInterface.renameColumn('sensors', 'hardwareType', 'hardware_type'),
      queryInterface.renameColumn('sensors', 'readingType', 'reading_type'),
      queryInterface.renameColumn('sensors', 'createdAt', 'created_at'),
      queryInterface.renameColumn('sensors', 'updatedAt', 'updated_at'),
      // Station
      queryInterface.renameColumn('stations', 'createdAt', 'created_at'),
      queryInterface.renameColumn('stations', 'updatedAt', 'updated_at'),
    ]),

  down: async (queryInterface, Sequelize) =>
    Promise.all([
      // Actions
      queryInterface.renameColumn('actions', 'station_id', 'stationId'),
      queryInterface.renameColumn('actions', 'sensor_id', 'sensorId'),
      queryInterface.renameColumn('actions', 'metadata', 'metaData'),
      queryInterface.renameColumn('actions', 'created_at', 'createdAt'),
      queryInterface.renameColumn('actions', 'updated_at', 'updatedAt'),
      // Dashboards
      queryInterface.renameColumn('dashboards', 'created_at', 'createdAt'),
      queryInterface.renameColumn('dashboards', 'updated_at', 'updatedAt'),
      // Reading
      queryInterface.renameColumn('readings', 'sensor_id', 'sensorId'),
      queryInterface.renameColumn('readings', 'station_id', 'stationId'),
      queryInterface.renameColumn('readings', 'created_at', 'createdAt'),
      queryInterface.renameColumn('readings', 'updated_at', 'updatedAt'),
      // Sensor
      queryInterface.renameColumn('sensors', 'hardware_name', 'hardwareName'),
      queryInterface.renameColumn('sensors', 'hardware_type', 'hardwareType'),
      queryInterface.renameColumn('sensors', 'reading_type', 'readingType'),
      queryInterface.renameColumn('sensors', 'station_id', 'stationId'),
      queryInterface.renameColumn('sensors', 'created_at', 'createdAt'),
      queryInterface.renameColumn('sensors', 'updated_at', 'updatedAt'),
      // Station
      queryInterface.renameColumn('stations', 'created_at', 'createdAt'),
      queryInterface.renameColumn('stations', 'updated_at', 'updatedAt'),
    ]),
};
