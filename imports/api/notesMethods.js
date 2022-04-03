import { check } from 'meteor/check';
import { NotesCollection, ViewsCollection } from '/imports/db/NotesCollection';

const defaultBox = {
  x: 50,
  y: 50,
  width: 150,
  height: 150
}


Meteor.methods({
  'notes.insert'(title, text, tags) {
    check(title, String);
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    views = {};
    for (const tag in tags) {
      if (tags[tag]) {
        views[tag] = defaultBox;
      }
    }
  
    let newNote = {
      title: title,
      text: text,
      views: views,
      createdAt: new Date(),
      userId: this.userId,
    }

    console.log(newNote);
    NotesCollection.insert(newNote);
  },

  'notes.remove'(noteId) {

    console.log("llok for ")

    check(noteId, String);
    console.log("go 1")
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
    console.log("go 2")
    
    
    const note = NotesCollection.findOne({ _id: noteId, userId: this.userId });


    if (!note) {
      throw new Meteor.Error('Access denied.');
    }

    console.log("go 3")
    
    NotesCollection.remove(noteId);
  },

  'notes.setIsChecked'(noteId, isChecked) {
    check(noteId, String);
    check(isChecked, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const note = NotesCollection.findOne({ 
      _id: noteId, 
      userId: this.userId 
    });

    if (!note) {
      throw new Meteor.Error('Access denied.');
    }

    NotesCollection.update(noteId, {$set: {isChecked}});
  },

  'notes.setTitle'(noteId, title) {
    check(noteId, String);
    check(title, String);
    
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const note = NotesCollection.findOne({ 
      _id: noteId, 
      userId: this.userId 
    });

    if (!note) {
      throw new Meteor.Error('Access denied.');
    }

    NotesCollection.update(noteId, {
      $set: {
        title: title
      },
    });    
  },

  'notes.setText'(noteId, text) {
    check(noteId, String);
    check(text, String);
    
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const note = NotesCollection.findOne({ 
      _id: noteId, 
      userId: this.userId 
    });

    if (!note) {
      throw new Meteor.Error('Access denied.');
    }

    NotesCollection.update(noteId, {$set: {text: text}});
  },

  'notes.setViewPosition'(noteId, view, box) {
    check(noteId, String);
    check(box.x, Number);
    check(box.y, Number);
    check(box.width, Number);
    check(box.height, Number);
    
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const note = NotesCollection.findOne({ 
      _id: noteId, 
      userId: this.userId 
    });

    if (!note) {
      throw new Meteor.Error('Access denied.');
    }
    
    let views = note.views ? note.views : {};
    views[view] = box;
    NotesCollection.update(noteId, {$set: {views: views}});
  },


  'notes.editView'(noteId, view, box) {
    check(noteId, String);
    check(box.x, Number);
    check(box.y, Number);
    check(box.width, Number);
    check(box.height, Number);
    console.log("GO!!")
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const note = NotesCollection.findOne({ 
      _id: noteId, 
      userId: this.userId 
    });

    if (!note) {
      throw new Meteor.Error('Access denied.');
    }
    
    let views = note.views ? note.views : {};
    views[view] = box;
    NotesCollection.update(noteId, {$set: {views: views}});
  },
  
  'notes.editViews'(noteId, tags) {
    check(noteId, String);
    console.log("GO!!!")
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const note = NotesCollection.findOne({ 
      _id: noteId, 
      userId: this.userId 
    });

    if (!note) {
      throw new Meteor.Error('Access denied.');
    }

    let views = note.views ? note.views : {};
    for (const tag in tags) {
      if (!views[tag] && tags[tag]) {
        views[tag] = defaultBox;
      } else if (views[tag] && !tags[tag]) {
        delete views[tag];
      }
    }  

    NotesCollection.update(noteId, {$set: {views: views}});
  },

  /*
  'notes.editView'(noteId, tag, assigned) {
    check(noteId, String);
    check(tag, String);
    check(assigned, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const note = NotesCollection.findOne({ 
      _id: noteId, 
      userId: this.userId 
    });

    if (!note) {
      throw new Meteor.Error('Access denied.');
    }

    let views = note.views ? note.views : {};
    if (!views[tag] && assigned) {
      views[tag] = defaultBox;
    } else if (views[tag] && !assigned) {
      delete views[tag];
      //views[tag] = undefined;
    }

    NotesCollection.update(noteId, {$set: {views: views}});
  },
  */

  'views.insert'(name) {
    check(name, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    ViewsCollection.insert({
      name: name,
      createdAt: new Date(),
      userId: this.userId,
    });
  },

  'views.remove'(viewId) {
    check(viewId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const view = ViewsCollection.findOne({ _id: viewId, userId: this.userId });

    if (!view) {
      throw new Meteor.Error('Access denied.');
    }

    ViewsCollection.remove(viewId);
  },

  'views.setName'(viewId, name) {
    check(viewId, String);
    check(name, String);
    
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const view = ViewsCollection.findOne({ 
      _id: viewId, 
      userId: this.userId 
    });

    if (!view) {
      throw new Meteor.Error('Access denied.');
    }

    ViewsCollection.update(viewId, {
      $set: {
        name: name
      },
    });    
  }

});
