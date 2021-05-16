const config = require('./config.json');
const fs = require('fs');

const { backstopBase, scenariosBase, scensNumber, stepsNumber, frameworks } = config;

async function runPreConfig() {
  if (scensNumber === 0) {
    return;
  }

  let scenarios = [];

  for (let f of frameworks) {

    for (let i = 0; i < scensNumber; i++) {
      for (let j = 0; j < stepsNumber; j++) {

        let scenName = `esc_${i + 1}_step_${j + 1}`;
        let urlBaseScreenshot = `./backstop_data/screenshots/${f}/v3.3.0/v3.3.0_${scenName}.png`;
        let urlTestScreenshot = `./backstop_data/screenshots/${f}/v3.42.5/v3.42.5_${scenName}.png`;

        if (fs.existsSync(urlBaseScreenshot) && fs.existsSync(urlTestScreenshot)) {
          scenarios.push(
              {
                ...scenariosBase,
                "label": `${f} Esc:${i + 1} Step:${j + 1}`,
                "url": urlTestScreenshot,
                "referenceUrl": urlBaseScreenshot
              }
          );
        }
      }
    }

    let backstop = {
      ...backstopBase,
      scenarios
    }

    fs.writeFileSync('backstop.json', JSON.stringify(backstop));
  }

  return scenarios;
}

(async () => console.log(await runPreConfig()))();
