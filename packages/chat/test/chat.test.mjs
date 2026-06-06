import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CHAT_SCOPE,
  defineChatScope,
  getChatScope,
  isSameAuthorRun,
  listChatScopes,
} from '../src/index.js';

test('@ric/chat exposes a resolvable scope registry', () => {
  assert.equal(typeof CHAT_SCOPE, 'object');
  const scopes = listChatScopes();
  assert.ok(Array.isArray(scopes) && scopes.length > 0, 'non-empty scopes');
  const key = Object.values(CHAT_SCOPE)[0];
  assert.ok(getChatScope(key), 'a CHAT_SCOPE value resolves to a scope');
});

test('@ric/chat exposes its helper surface', () => {
  assert.equal(typeof defineChatScope, 'function');
  assert.equal(typeof isSameAuthorRun, 'function');
});
