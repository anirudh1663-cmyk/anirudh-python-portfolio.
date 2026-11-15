import { createApp } from './app.mjs';
import { db } from '../../db/index.ts';
import { messages } from '../../db/schema.ts';

export default createApp(async (message) => {
  await db.insert(messages).values(message);
});
