// =============================================================================
// @ric/chat/react — transport-agnostic chat-at-a-place components
// =============================================================================
// Render a resolved message list, emit composer events. No knowledge of where
// messages live (Firestore / RTDB / local mesh / websocket) — the app wires
// `messages` in and handles `onSend` out. Scope is a prop, so the same thread
// renders a public place room, a private meetup, or any registered scope.
// =============================================================================

import { useState } from 'react';

import { Pill, IconButton } from '@ric/ui-core/react';
import { cx } from '@ric/ui-core';

import { getChatScope, isSameAuthorRun } from './index.js';

/** Scope header chip. @param {{scope?:string, className?:string}} props */
export function ChatScopeBadge({ scope, className }) {
  const meta = getChatScope(scope);
  if (!meta) return null;
  return <Pill tone={meta.tone} size="sm" className={className}>{meta.label}</Pill>;
}

/**
 * One message bubble. Outgoing (`mine`) bubbles align right with an accent
 * fill; incoming align left with author header when starting a new run.
 * @param {{message: import('./index.js').ChatMessageView, showAuthor?:boolean, className?:string}} props
 */
export function ChatMessage({ message, showAuthor = true, className }) {
  const { text, mine, authorName, avatarUrl, pending } = message;
  return (
    <div className={cx('flex w-full gap-2', mine ? 'flex-row-reverse' : 'flex-row', className)}>
      {!mine && showAuthor ? (
        <span className="mt-auto inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-700 text-[10px] font-semibold text-white">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={authorName || ''} className="h-full w-full object-cover" />
          ) : (
            (authorName || '?').slice(0, 1).toUpperCase()
          )}
        </span>
      ) : (
        !mine && <span className="w-7 shrink-0" aria-hidden="true" />
      )}
      <div className="flex max-w-[78%] flex-col">
        {!mine && showAuthor && authorName ? (
          <span className="mb-0.5 px-1 text-[11px] font-medium text-white/60">{authorName}</span>
        ) : null}
        <div
          className={cx(
            'rounded-2xl px-3 py-2 text-sm',
            mine ? 'bg-fuchsia-500/30 text-fuchsia-50' : 'bg-white/10 text-white/90',
            pending && 'opacity-60',
          )}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

/**
 * Scrollable message thread. Collapses repeated-author headers via
 * isSameAuthorRun. Newest-at-bottom is the caller's ordering responsibility.
 * @param {{messages?: import('./index.js').ChatMessageView[], scope?:string, emptyLabel?:string, className?:string}} props
 */
export function ChatThread({ messages = [], scope, emptyLabel = 'No messages yet', className }) {
  if (!messages.length) {
    return (
      <div className={cx('flex flex-1 items-center justify-center p-6 text-sm text-white/50', className)}>
        {emptyLabel}
      </div>
    );
  }
  return (
    <div className={cx('flex flex-1 flex-col gap-1 overflow-y-auto p-3', className)} role="log" aria-live="polite" data-scope={scope}>
      {messages.map((msg, i) => (
        <ChatMessage key={msg.id} message={msg} showAuthor={!isSameAuthorRun(messages[i - 1], msg)} />
      ))}
    </div>
  );
}

/**
 * Controlled-or-uncontrolled composer. Calls `onSend(text)` and clears.
 * @param {{onSend:(text:string)=>void, placeholder?:string, sendIcon?:any, disabled?:boolean, className?:string}} props
 */
export function ChatComposer({ onSend, placeholder = 'Message…', sendIcon, disabled, className }) {
  const [value, setValue] = useState('');
  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
  };
  return (
    <form
      className={cx('flex items-center gap-2 border-t border-white/10 p-2', className)}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="min-w-0 flex-1 rounded-full bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/40"
      />
      <IconButton
        label="Send message"
        variant="primary"
        size="sm"
        icon={sendIcon || <span aria-hidden="true">↑</span>}
        onClick={submit}
      />
    </form>
  );
}
