import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const LOCAL_STORAGE_KEY = 'bulk-add';

const BulkAdd = ({ className, close, stations }) => {
  const [input, setInput] = useState({});
  const [availableSensors, setAvaliableSensors] = useState([]);
  const [selectedNewSensor, setSelectedNewSensor] = useState('');

  useEffect(() => {
    const cachedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    const usedNames = cachedItems.split(':');

    setInput(
      usedNames.reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: 0,
        }),
        {},
      ),
    );

    const sensors = stations.reduce(
      (acc, cur) => [
        ...acc,
        ...cur.sensors
          .filter(sensor => !usedNames.includes(sensor.name))
          .map(sensor => ({
            id: sensor.id,
            name: sensor.name,
          })),
      ],
      [],
    );
    setAvaliableSensors(sensors);
  }, [stations]);

  const preventClose = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleInputChange = event => {
    setInput({
      ...input,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleNewField = () => {
    setAvaliableSensors(availableSensors.filter(sensor => sensor.name !== selectedNewSensor));
    setInput({
      ...input,
      [selectedNewSensor]: 'a',
    });
  };

  const handleSelectChange = event => {
    setSelectedNewSensor(event.target.value);
  };

  const submitAdd = () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      Object.keys(input).reduce((acc, cur) => `${acc}:${cur}`),
      '',
    );

    const readings = Object.keys(input).map(sensorName => {
      const station = stations.filter(sta =>
        sta.sensors.map(sensor => sensor.name).includes(sensorName),
      )[0];

      const sensor = station.sensors.filter(sense => sense.name === sensorName)[0];

      return {
        value: input[sensorName],
        timestamp: new Date(),
        sensorId: sensor.id,
        stationId: station.id,
      };
    });

    fetch('/api/reading/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        readings,
      }),
    });
  };

  return (
    <div className={className} onClick={close}>
      <div className="modal" onClick={preventClose}>
        <div className="title">Bulk Add</div>
        <div className="body">
          {Object.entries(input).map(([key, value]) => (
            <div>
              {key}
              <input type="number" value={value} onChange={handleInputChange} name={key} />
            </div>
          ))}
          <div className="add-entry">
            Add new Sensor
            <select value={selectedNewSensor} onChange={handleSelectChange}>
              {availableSensors.map(sensor => (
                <option key={sensor.id} value={sensor.name}>
                  {sensor.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={handleNewField}>
              +
            </button>
          </div>
        </div>
        <div className="footer">
          <button type="button" onClick={submitAdd}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

BulkAdd.propTypes = {
  className: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  stations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      health: PropTypes.oneOf(['healthy', 'unhealthy']),
      address: PropTypes.string.isRequired,
      port: PropTypes.string.isRequired,
      sensors: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          health: PropTypes.oneOf(['healthy', 'unhealthy']),
        }),
      ),
    }),
  ),
};

BulkAdd.defaultProps = {
  stations: [],
};

const styledBulkAdd = styled(BulkAdd)`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 2;

  .modal {
    width: 600px;
    height: 601px;
    background: white;
    margin: 5rem auto;
    border-radius: 0.5rem;
    padding: 1rem;
    box-sizing: border-box;
  }
`;

export default styledBulkAdd;
