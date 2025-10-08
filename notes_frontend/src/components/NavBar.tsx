import { component$ } from "@builder.io/qwik";

/**
 * Top navigation bar with branding and subtle glass background.
 */
// PUBLIC_INTERFACE
export const NavBar = component$(() => {
  return (
    <header class="navbar surface">
      <div class="navbar-inner" role="navigation" aria-label="Top navigation">
        <div class="brand" aria-label="App brand">
          <span class="dot" aria-hidden="true" />
          <span>Ocean Notes</span>
          <small>Professional</small>
        </div>
        <div class="row" style={{ gap: "0.5rem" }}>
          <a
            class="btn ghost"
            href="https://qwik.dev/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Qwik documentation"
          >
            Docs
          </a>
        </div>
      </div>
    </header>
  );
});
