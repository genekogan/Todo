import { Meteor } from 'meteor/meteor';
import { NotesCollection, ViewsCollection } from '/imports/db/NotesCollection';

Meteor.publish('notes', function publishNotes() {
  return NotesCollection.find({ userId: this.userId });
});

Meteor.publish('views', function publishViews() {
  return ViewsCollection.find({ userId: this.userId });
});
