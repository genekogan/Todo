import { Mongo } from 'meteor/mongo';

export const NotesCollection = new Mongo.Collection('notes');
export const ViewsCollection = new Mongo.Collection('views');
