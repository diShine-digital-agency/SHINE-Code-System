// Shared output helper for SHINE hooks.
// If SHINE_HOOK_FORMAT=json, emits one JSON object per line to stderr.
// Otherwise, emits the human-readable text exactly as before.
// Fails open on any error — hooks must never break the session.
'use strict';

function emit(hook, level, text, extra) {
  const json = process.env.SHINE_HOOK_FORMAT === 'json';
  try {
    if (json) {
      const obj = Object.assign({
        ts: new Date().toISOString(),
        hook,
        level,             // 'info' | 'warn' | 'block'
        message: text,
      }, extra || {});
      process.stderr.write(JSON.stringify(obj) + '\n');
    } else {
      process.stderr.write(text + (text.endsWith('\n') ? '' : '\n'));
    }
  } catch { /* fail open */ }
}

module.exports = { emit };
