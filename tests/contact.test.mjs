import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createApp } from '../netlify/server/app.mjs';

async function withServer(save, run) {
  const server = createServer(createApp(save));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  try { await run(url); } finally { await new Promise(resolve => server.close(resolve)); }
}
const valid = { name: 'Anirudh', email: 'person@example.org', message: 'Let us discuss a project.' };
const send = (url, body, headers = {}) => fetch(`${url}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });

test('valid contact is persisted before success and trimmed', async () => {
  let saved;
  await withServer(async value => { saved = value; }, async url => {
    const response = await send(url, { ...valid, name: ' Anirudh ' });
    assert.equal(response.status, 201);
    assert.deepEqual(saved, valid);
  });
});
test('invalid contact never reaches storage', async () => {
  await withServer(() => assert.fail('must not save'), async url => {
    for (const body of [{}, { ...valid, email: 'bad' }, { ...valid, message: 'short' }, { ...valid, name: 'a'.repeat(101) }]) {
      assert.equal((await send(url, body)).status, 400);
    }
  });
});
test('storage failure reports failure without leaking internals', async () => {
  await withServer(() => { throw new Error('private database details'); }, async url => {
    const response = await send(url, valid);
    assert.equal(response.status, 503);
    assert.doesNotMatch(await response.text(), /private database/);
  });
});
test('spam, foreign origins, malformed bodies, and unsupported methods', async () => {
  await withServer(() => assert.fail('must not save'), async url => {
    assert.equal((await send(url, { ...valid, website: 'spam' })).status, 201);
    assert.equal((await send(url, valid, { Origin: 'https://unrelated.example' })).status, 403);
    assert.equal((await fetch(`${url}/api/contact`)).status, 405);
    assert.equal((await fetch(`${url}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })).status, 400);
    assert.equal((await fetch(`${url}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'x'.repeat(17000) }) })).status, 413);
  });
});
