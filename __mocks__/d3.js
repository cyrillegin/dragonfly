const scaleTime = () => ({ range: () => ({ domain: () => {} }) });
const scaleLinear = () => ({ range: () => ({ domain: () => {} }) });
const extent = () => {};
const line = () => ({ x: () => ({ y: () => {} }) });
const select = () => ({
  html: () => ({
    append: () => ({
      attr: () => ({
        attr: () => ({
          append: () => ({
            attr: () => ({
              // svg
              append: () => ({
                attr: () => ({
                  attr: () => ({
                    call: () => {},
                    attr: () => ({ attr: () => ({ attr: () => ({}) }) }),
                  }),
                  call: () => ({ call: () => ({ call: () => ({ call: () => {} }) }) }),
                  text: () => ({}),
                }),
                data: () => ({ attr: () => ({ attr: () => ({}) }) }),
                text: () => ({ attr: () => ({ attr: () => ({}) }) }),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
});

const axisBottom = () => ({ ticks: () => ({ tickFormat: () => ({}) }) });
const axisLeft = () => ({ tickSize: () => ({}) });
const timeFormat = () => {};

export { scaleTime, scaleLinear, extent, line, select, axisBottom, axisLeft, timeFormat };
