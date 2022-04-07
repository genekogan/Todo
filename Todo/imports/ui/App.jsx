import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NotesCollection, ViewsCollection } from '/imports/db/NotesCollection';
import { Note } from './Note';
import { Toolbar } from './NoteForm';
import { LoginForm } from './LoginForm';


export const App = () => {
  const user = useTracker(() => Meteor.user());
  const logout = () => Meteor.logout();
  const [activeView, setActiveView] = useState(0);
  onViewSelect = (value) => {setActiveView(value)};

  // get notes, views
  const { notes, views, isLoading } = useTracker(() => {
    const noDataAvailable = { notes: [], views: [] };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handlerNotes = Meteor.subscribe('notes');
    const handlerViews = Meteor.subscribe('views');
    if (!handlerNotes.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }
    if (!handlerViews.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }
    const userFilter = user ? { userId: user._id } : {};
    const notes = NotesCollection.find({}, {}).fetch();    
    const views = ViewsCollection.find(userFilter, {sort: { createdAt: -1 }}).fetch();
    return { notes, views };
  });

  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <Toolbar views={views} activeView={activeView} onViewSelect={onViewSelect} />
            {/* <div className="user" style={{float:"left"}} onClick={logout}>
              {user ? user.name : "not logged in"} 🚪
            </div> */}
          </div>
        </div>
      </header>
      <div className="main">
        {user ? (
          <>
            {isLoading && <div className="loading">loading...</div>}
            {notes.map(note => (note.views && note.views[activeView]) ? (
              <Note
                key={note._id}
                note={note}
                view={activeView}
                allViews={views}
              />
            ) : (<></>))}
          </>
        ) : (
          <LoginForm />
        )}

      </div>
    </div>
  );
};
