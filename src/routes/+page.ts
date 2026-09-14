// The page's state (theme seed, mode) lives in localStorage, so the server can
// only ever render the defaults. Hydrating that markup clobbers the real values
// — `bind:value` on the colour picker adopts the server-rendered default and
// writes it straight back to storage. Render this route on the client only.
export const ssr = false;
