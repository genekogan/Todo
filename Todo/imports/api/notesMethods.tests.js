import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { mockMethodCall } from 'meteor/quave:testing';
import { assert } from 'chai';
import { NotesCollection } from '/imports/db/NotesCollection';
import '/imports/api/notesMethods';

if (Meteor.isServer) {
  describe('Notes', () => {
    describe('methods', () => {
      const userId = Random.id();
      let noteId;

      beforeEach(() => {
        NotesCollection.remove({});
        noteId = NotesCollection.insert({
          title: 'Test Note',
          text: 'Test Note description',
          createdAt: new Date(),
          userId,
        });
      });

      it('can delete owned note', () => {
        mockMethodCall('notes.remove', noteId, { context: { userId } });

        assert.equal(NotesCollection.find().count(), 0);
      });

      it('can\'t delete note without an user authenticated', () => {
        const fn = () => mockMethodCall('notes.remove', noteId);
        assert.throw(fn, /Not authorized/);
        assert.equal(NotesCollection.find().count(), 1);
      });

      it('can\'t delete note from another owner', () => {
        const fn = () =>
          mockMethodCall('notes.remove', noteId, {
            context: { userId: 'somebody-else-id' },
          });
        assert.throw(fn, /Access denied/);
        assert.equal(NotesCollection.find().count(), 1);
      });

      it('can change the status of a note', () => {
        const originalNote = NotesCollection.findOne(noteId);
        mockMethodCall('notes.setIsChecked', noteId, !originalNote.isChecked, {
          context: { userId },
        });

        const updatedNote = NotesCollection.findOne(noteId);
        assert.notEqual(updatedNote.isChecked, originalNote.isChecked);
      });

      it('can insert new notes', () => {
        const title = 'New Note';
        const text = 'New Note description';
        mockMethodCall('notes.insert', (title, text), {
          context: { userId },
        });

        const notes = NotesCollection.find({}).fetch();
        assert.equal(notes.length, 2);
        assert.isTrue(notes.some(note => note.text === text));
      });
    });
  });
}
