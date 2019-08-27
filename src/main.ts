import * as core from "@actions/core";
import walkCommits from "./walk-commits";

async function run() {
  try {
    // const myInput = core.getInput("myInput");
    // core.debug(`Hello ${myInput}`);
    // console.log(`Hello ${myInput}`);

    for await (let data of walkCommits()) {
      console.log(data);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
