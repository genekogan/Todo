import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { NotesCollection } from '/imports/db/NotesCollection';
import '/imports/api/notesMethods';
import '/imports/api/notesPublications';
require('dotenv').config()


const insertNote = (noteTitle, noteText, user) =>
  NotesCollection.insert({
    title: noteTitle,
    text: noteText,
    views: {},
    userId: user._id,
    createdAt: new Date(),
  });
  

Meteor.startup(() => {
  //const USERNAME = process.env.REACT_APP_DASHBOARD_USERNAME;
  //const PASSWORD = process.env.REACT_APP_DASHBOARD_PASSWORD;
  const USERNAME = 'gene'
  const PASSWORD = 'password'

  if (!Accounts.findUserByUsername(USERNAME)) {
    Accounts.createUser({
      username: USERNAME,
      password: PASSWORD,
    });
  }

  const user = Accounts.findUserByUsername(USERNAME);

  /*
  if (NotesCollection.find().count() === 0) {
    [
      {noteTitle: 'First Note', noteText: 'This is the beginning'},
    ].forEach(note => insertNote(note.noteTitle, note.noteText, user));
  }
  */

});


