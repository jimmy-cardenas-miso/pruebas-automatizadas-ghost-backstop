const fs = require('fs');

const frameworks = ["cypress", "kraken"];
const scensNumber = 20;
const stepsNumber = 30;
const BACKSTOP_BASE = {
  "id": "backstop_default",
  "viewports": [
    {
      "label": "default",
      "width": 800,
      "height": 600
    }
  ],
  "onBeforeScript": "puppet/onBefore.js",
  "onReadyScript": "puppet/onReady.js",
  "scenarios": [],
  "paths": {
    "bitmaps_reference": "backstop_data/bitmaps_reference",
    "bitmaps_test": "backstop_data/bitmaps_test",
    "engine_scripts": "backstop_data/engine_scripts",
    "html_report": "backstop_data/html_report",
    "ci_report": "backstop_data/ci_report"
  },
  "report": ["browser"],
  "engine": "puppeteer",
  "engineOptions": {
    "args": ["--no-sandbox"]
  },
  "asyncCaptureLimit": 5,
  "asyncCompareLimit": 50,
  "debug": false,
  "debugWindow": false
};

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
                "label": `${f} Esc:${i + 1} Step:${j + 1}`,
                "url": urlTestScreenshot,
                "referenceUrl": urlBaseScreenshot,
                "readyEvent": "",
                "readySelector": "",
                "delay": 0,
                "hideSelectors": [],
                "removeSelectors": [],
                "hoverSelector": "",
                "clickSelector": "",
                "postInteractionWait": 1,
                "selectors": [],
                "selectorExpansion": true,
                "expect": 0,
                "misMatchThreshold" : 8,
                "requireSameDimensions": true
              }
          );
        }
      }
    }

    let backstop = {
      ...BACKSTOP_BASE,
      scenarios
    }

    fs.writeFileSync('backstop.json', JSON.stringify(backstop));
  }

  return scenarios;
}

(async () => console.log(await runPreConfig()))();
