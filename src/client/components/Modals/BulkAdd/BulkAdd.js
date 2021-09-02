import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Store from '../../../utilities/Store';
import Api from '../../../Api';

const LOCAL_STORAGE_KEY = 'bulk-add';

const BulkAdd = ({ className, close, stations }) => {
  const [input, setInput] = useState({});
  const [availableSensors, setAvaliableSensors] = useState([]);
  const [selectedNewSensor, setSelectedNewSensor] = useState('');

  const handleSelectChange = event => {
    setSelectedNewSensor(event.target.value);
  };

  useEffect(() => {
    const cachedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    let usedNames = [];
    if (cachedItems) {
      usedNames = cachedItems.split(':');
      const date = new Date();
      setInput(
        usedNames.reduce(
          (acc, cur) => ({
            ...acc,
            [cur]: {
              value: 0,
              date: `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
            },
          }),
          {},
        ),
      );
    }

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
    // Mock initial select option.
    handleSelectChange({ target: { value: sensors[0].name } });
  }, [stations]);

  const preventClose = event => {
    event.stopPropagation();
  };

  const handleNewField = () => {
    setAvaliableSensors(availableSensors.filter(sensor => sensor.name !== selectedNewSensor));
    const date = new Date();
    setInput({
      ...input,
      [selectedNewSensor]: {
        value: 0,
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      },
    });
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
        value: input[sensorName].value,
        timestamp: input[sensorName].date,
        sensorId: sensor.id,
        stationId: station.id,
      };
    });

    Api.addBulkReadings(readings).then(() => {
      Store.refreshFn();
      close();
    });
  };

  const handleRemove = event => {
    const { name } = event.target;

    const { id } = stations
      .find(station => station.sensors.map(sensor => sensor.name).includes(name))
      .sensors.find(sensor => sensor.name === name);

    setAvaliableSensors([...availableSensors, { id, name }]);

    delete input[name];
    setInput({
      ...input,
    });
  };

  const handleInputChange = event => {
    setInput({
      ...input,
      [event.target.name]: {
        value: event.target.value,
        date: input[event.target.name].date,
      },
    });
  };
  const handleDateChange = event => {
    setInput({
      ...input,
      [event.target.name]: {
        value: input[event.target.name].value,
        date: event.target.value,
      },
    });
  };

  return (
    <div className={className} onClick={close}>
      <div className="modal" onClick={preventClose}>
        <div className="title">Bulk Add</div>
        <div className="body">
          {Object.entries(input).map(([key, value]) => (
            <div key={key}>
              {key}
              <input type="number" value={value.value} onChange={handleInputChange} name={key} />
              <input type="date" value={value.date} onChange={handleDateChange} name={key} />
              <button type="button" onClick={handleRemove} name={key}>
                -
              </button>
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
