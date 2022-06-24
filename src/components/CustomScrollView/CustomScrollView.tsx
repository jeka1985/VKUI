import * as React from "react";
import { DOMProps, useDOM } from "../../lib/dom";
import { classNames } from "../../lib/classNames";
import { useIsomorphicLayoutEffect } from "../../lib/useIsomorphicLayoutEffect";
import { useExternRef } from "../../hooks/useExternRef";
import { useEventListener } from "../../hooks/useEventListener";
import {
  TrackerOptionsProps,
  useTrackerVisibility,
} from "./useTrackerVisibility";
import "./CustomScrollView.css";

export interface CustomScrollViewProps extends DOMProps, TrackerOptionsProps {
  windowResize?: boolean;
  boxRef?: React.Ref<HTMLDivElement>;
  className?: HTMLDivElement["className"];
  children: React.ReactNode;
}

export const CustomScrollView = ({
  className,
  children,
  boxRef: externalBoxRef,
  windowResize,
  hideScrollbar = false,
  hideScrollbarDelay,
}: CustomScrollViewProps) => {
  const { document, window } = useDOM();

  const ratio = React.useRef(NaN);
  const lastTrackerTop = React.useRef(0);
  const clientHeight = React.useRef(0);
  const trackerHeight = React.useRef(0);
  const scrollHeight = React.useRef(0);
  const transformProp = React.useRef("");
  const startY = React.useRef(0);
  const trackerTop = React.useRef(0);

  const boxRef = useExternRef(externalBoxRef);

  const barY = React.useRef<HTMLDivElement>(null);
  const trackerY = React.useRef<HTMLDivElement>(null);

  const setTrackerPosition = (scrollTop: number) => {
    lastTrackerTop.current = scrollTop;
    if (trackerY.current !== null) {
      (trackerY.current.style as any)[
        transformProp.current
      ] = `translate(0, ${scrollTop}px)`;
    }
  };

  const setTrackerPositionFromScroll = (scrollTop: number) => {
    const progress = scrollTop / (scrollHeight.current - clientHeight.current);
    setTrackerPosition(
      (clientHeight.current - trackerHeight.current) * progress
    );
  };

  const resize = () => {
    if (!boxRef.current || !barY.current || !trackerY.current) {
      return;
    }
    const localClientHeight = boxRef.current.clientHeight;
    const localScrollHeight = boxRef.current.scrollHeight;
    const localRatio = localClientHeight / localScrollHeight;
    const localTrackerHeight = Math.max(localClientHeight * localRatio, 40);

    ratio.current = localRatio;
    clientHeight.current = localClientHeight;
    scrollHeight.current = localScrollHeight;
    trackerHeight.current = localTrackerHeight;

    if (localRatio >= 1) {
      barY.current.style.display = "none";
    } else {
      barY.current.style.display = "";
      trackerY.current.style.height = `${localTrackerHeight}px`;
      setTrackerPositionFromScroll(boxRef.current.scrollTop);
    }
  };

  const resizeHandler = useEventListener("resize", resize);

  useIsomorphicLayoutEffect(() => {
    if (windowResize && window) {
      resizeHandler.add(window);
    }
  }, [windowResize, window]);

  useIsomorphicLayoutEffect(() => {
    let style = trackerY.current?.style;
    let prop = "";
    if (style !== undefined) {
      if ("transform" in style) {
        prop = "transform";
      } else if ("webkitTransform" in style) {
        prop = "webkitTransform";
      }
    }
    transformProp.current = prop;
  }, []);

  useIsomorphicLayoutEffect(resize);

  const setScrollPositionFromTracker = (trackerTop: number) => {
    const progress =
      trackerTop / (clientHeight.current - trackerHeight.current);
    if (boxRef.current !== null) {
      boxRef.current.scrollTop =
        (scrollHeight.current - clientHeight.current) * progress;
    }
  };

  const onMove = (e: MouseEvent) => {
    e.preventDefault();
    const diff = e.clientY - startY.current;
    const position = Math.min(
      Math.max(trackerTop.current + diff, 0),
      clientHeight.current - trackerHeight.current
    );

    setScrollPositionFromTracker(position);
  };

  const { trackerVisible, queueTrackerVisibility, changeTrackerVisiblity } =
    useTrackerVisibility(hideScrollbar, hideScrollbarDelay);

  const onUp = (e: MouseEvent) => {
    e.preventDefault();

    if (hideScrollbar) {
      changeTrackerVisiblity(e.target === trackerY.current, false);
    }

    unsubscribe();
  };

  const scroll = () => {
    if (ratio.current >= 1 || !boxRef.current) {
      return;
    }

    if (hideScrollbar) {
      queueTrackerVisibility();
    }

    setTrackerPositionFromScroll(boxRef.current.scrollTop);
  };

  const listeners = [
    useEventListener("mousemove", onMove),
    useEventListener("mouseup", onUp),
  ];

  function subscribe(el: Document | undefined) {
    if (el) {
      listeners.forEach((l) => l.add(el));
    }
  }

  function unsubscribe() {
    listeners.forEach((l) => l.remove());
  }

  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    startY.current = e.clientY;
    trackerTop.current = lastTrackerTop.current;

    if (hideScrollbar) {
      changeTrackerVisiblity(true, true);
    }

    subscribe(document);
  };

  const onMouseEnter = hideScrollbar
    ? () => changeTrackerVisiblity(true)
    : undefined;
  const onMouseLeave = hideScrollbar
    ? () => changeTrackerVisiblity(false)
    : undefined;

  return (
    <div vkuiClass="CustomScrollView" className={className}>
      <div vkuiClass="CustomScrollView__barY" ref={barY}>
        <div
          vkuiClass={classNames(
            "CustomScrollView__trackerY",
            !trackerVisible && `CustomScrollView__trackerY--hidden`
          )}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          ref={trackerY}
          onMouseDown={onDragStart}
        />
      </div>

      <div
        vkuiClass="CustomScrollView__box"
        tabIndex={-1}
        ref={boxRef}
        onScroll={scroll}
      >
        {children}
      </div>
    </div>
  );
};
