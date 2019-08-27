import * as core from "@actions/core";

async function run() {
  try {
    const myInput = core.getInput("myInput");
    core.debug(`Hello ${myInput}`);
    console.log(`Hello ${myInput}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
