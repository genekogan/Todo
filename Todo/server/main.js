import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { NotesCollection } from '/imports/db/NotesCollection';
import '/imports/api/notesMethods';
import '/imports/api/notesPublications';
const { exec } = require("child_process");

const dataDir = `../../../../../../data`
const mongoPort = 62992
const msPerExport = 1000 * 60 * 1; // 60 * 12;


const runSystemCommand = async (command) => {
  return new Promise(resolve => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          resolve(undefined);
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
      }
      resolve(stdout);
    })
  });  
}

const runArchiveChecker = async () => {
  cmdExport =  `mongoexport --forceTableScan --host localhost --port ${mongoPort} --db meteor --collection notes --out ${dataDir}/notes.json;`
  cmdExport += `mongoexport --forceTableScan --host localhost --port ${mongoPort} --db meteor --collection views --out ${dataDir}/views.json;`
  cmdLog = `cd ${dataDir}; git log -1 --format=%cd`
  cmdCommit = `cd ${dataDir}; git add *json; git commit --allow-empty -m "${new Date()}"`
  lastExportStr = await runSystemCommand(cmdLog);
  if (lastExportStr) {
    lastExport = new Date(lastExportStr);
    msSinceLastExport = new Date() - lastExport;
    if (msSinceLastExport > msPerExport) {
      console.log(`Archived ${new Date()}`)
      await runSystemCommand(cmdExport);
      await runSystemCommand(cmdCommit);
    }
  } else {
    console.log(`Initialized archive on ${new Date()}`)
    await runSystemCommand(cmdExport);
    await runSystemCommand(cmdCommit);
  }
}


const revertToDate = async () => {
  // export current to notes_current.json (temp)
  // git show f86d1619b06cc217f11b54b49d7eb5bdc070fe28:notes.json > notes_old.json (temp)
  // disable saveLoop
  // mongoimport notes_old.json
  // make button to go back to normal

}


Meteor.startup(() => {
  const USERNAME = 'gene'     // process.env.REACT_APP_DASHBOARD_USERNAME;
  const PASSWORD = 'password' // process.env.REACT_APP_DASHBOARD_PASSWORD;

  if (!Accounts.findUserByUsername(USERNAME)) {
    Accounts.createUser({
      username: USERNAME,
      password: PASSWORD,
    });
  }
  
  const runArchiveLoop = async () => {
    setTimeout(async () => {
      await runArchiveChecker();
      runArchiveLoop();
    }, 6000);
  }
  runArchiveLoop();

});
