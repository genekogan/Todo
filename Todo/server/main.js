import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { NotesCollection } from '/imports/db/NotesCollection';
import '/imports/api/notesMethods';
import '/imports/api/notesPublications';
const { exec } = require("child_process");


const MS_BETWEEN_UPDATES = 1000 * 60 * 1;


const runSystemCommand = async (command) => {
  return new Promise(resolve => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      resolve(stdout);
    })
  });  
}


const insertNote = (noteTitle, noteText, user) =>
  NotesCollection.insert({
    title: noteTitle,
    text: noteText,
    views: {},
    userId: user._id,
    createdAt: new Date(),
  });
  

Meteor.startup(() => {
  const USERNAME = 'gene'     // process.env.REACT_APP_DASHBOARD_USERNAME;
  const PASSWORD = 'password' // process.env.REACT_APP_DASHBOARD_PASSWORD;

  if (!Accounts.findUserByUsername(USERNAME)) {
    Accounts.createUser({
      username: USERNAME,
      password: PASSWORD,
    });
  }

  const user = Accounts.findUserByUsername(USERNAME);

  /*
  if (NotesCollection.find().count() === 0) {
    note => insertNote('First Note', 'This is the beginning', user)
  }
  */


/*
  const exportDB = async () => {
    console.log('expor???t')
    cmd = 'mongoexport --forceTableScan --host localhost --port 3006 --db meteor --collection notes --out ../../../../../private/test.json';
    result = await runSystemCommand(cmd)
    console.log("export ? ")
    console.log(result);
    console.log("------")
    return result;
  }

  const commitToGit = async () => {
    console.log("commit>?!")
    cmd = 'cd ../../../../../private/; git add *json; git commit -m "'+new Date()+'"';
    console.log(cmd)
    result = await runSystemCommand(cmd);
    console.log("RESUL:T", result)
    return result;
  }


  const runExport = async () => {
    console.log('try export')
    cmd = 'cd ../../../../../private/; git log -1 --format=%cd'
    lastExport = new Date(await runSystemCommand(cmd));
    delta = new Date() - lastExport;
    console.log(delta)
    if (delta > MS_BETWEEN_UPDATES) {
      console.log('yay111')
      await exportDB();
      console.log("now!!!")
      await commitToGit();
      console.log("go????")
    }
    
  }

  

  const runLoop = async () => {
    console.log("run loop")
    setTimeout(function() {
      await runExport();
      runLoop();
    }, 5000);
  }

  runLoop();
*/




});


