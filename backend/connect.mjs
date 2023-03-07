import { Database } from 'sqlite-async';

const dbPath = '../database/db.sqlite';
export const db = await Database.open(dbPath);
