/**
 * Copyright 2025 Meta-Hybrid Mount Authors SPDX-License-Identifier:
 * GPL-3.0-or-later
 */

import type { ParentProps } from "solid-js";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";

import "./BottomActions.css";

export default function BottomActions(props: ParentProps) {
  const [isActivePage, setIsActivePage] = createSignal(true);
  let anchorRef: HTMLDivElement | undefined;
  let rootRef: HTMLDivElement | undefined;

  onMount(() => {
    const pageEl = anchorRef?.closest(".swipe-page");
    const rootEl = anchorRef?.closest(".main-content");
    if (!pageEl || !rootEl) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActivePage(entry.isIntersecting && entry.intersectionRatio >= 0.6);
      },
      {
        root: rootEl,
        threshold: [0.6],
      },
    );

    observer.observe(pageEl);
    onCleanup(() => observer.disconnect());
  });

  createEffect(() => {
    if (!rootRef) {
      return;
    }

    rootRef.toggleAttribute("inert", !isActivePage());
  });

  return (
    <>
      <div class="bottom-actions-anchor" ref={anchorRef} aria-hidden="true" />
      <Portal>
        <div
          ref={rootRef}
          class="bottom-actions-root"
          classList={{ "is-active": isActivePage() }}
        >
          {props.children}
        </div>
      </Portal>
    </>
  );
}
