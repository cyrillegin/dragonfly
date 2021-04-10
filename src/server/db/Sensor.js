import { Model, DataTypes } from 'sequelize';

class Sensor extends Model {}

function buildSensorSchema(sequelize) {
  Sensor.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      stationId: { type: DataTypes.INTEGER, allowNull: false, field: 'station_id' },
      coefficients: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.STRING, allowNull: true },
      hardwareName: { type: DataTypes.STRING, allowNull: false, field: 'hardware_name' },
      hardwareType: { type: DataTypes.STRING, allowNull: false, field: 'hardware_type' },
      readingType: { type: DataTypes.STRING, allowNull: true, field: 'reading_type' },
      poll_rate: { type: DataTypes.STRING, allowNull: true },
      unit: { type: DataTypes.STRING, allowNull: true },
      lastHealthTimestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'last_health_timestamp',
      },
    },
    {
      sequelize,
      modelName: 'sensor',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      underscored: true,
    },
  );
}

export { Sensor, buildSensorSchema };
