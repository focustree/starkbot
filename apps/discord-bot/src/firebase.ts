import { initializeApp } from 'firebase/app';
import {
  collection,
  CollectionReference,
  connectFirestoreEmulator,
  DocumentData,
  Firestore,
  getFirestore,
} from 'firebase/firestore';
import { Config } from './config';

export function initFirebase(config: Config) {
  const app = initializeApp(config.firebaseConfig);
  const firestore = getFirestore(app);
  if (config.env === 'local') {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
  }

  const collections = {
    guilds: createCollection<GuildDoc>(firestore, 'guilds'),
  };
  return { app, firestore, ...collections };
}

export type Firebase = ReturnType<typeof initFirebase>;

export interface GuildDoc {
  id: string;
  name: string;
  members: Array<{
    id: string;
    username: string;
  }>;
}

// This is just a helper to add the type to the db responses
const createCollection = <T = DocumentData>(
  firestore: Firestore,
  collectionName: string
) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};
