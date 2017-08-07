import gaugeController from './gauge.controller';
import gauge from './gauge.html';
import './gauge.style.scss';

const gaugecomponent = {
    template: gauge,
    controller: gaugeController,
    bindings: {
        'attributes': '<',
    }
};

export default gaugecomponent;
