import * as React from "react";
import { useTimeout } from "../../hooks/useTimeout";

export interface TrackerOptionsProps {
  /**
   * Скрывать ли ползунок скроллбара
   */
  hideScrollbar?: boolean;
  /**
   * Через какое кол-во миллисекунд ползунок скроллбара скрывается
   */
  hideScrollbarDelay?: number;
}

export interface TrackerVisibilityProps {
  /**
   * Отвечает за видимость ползунка
   */
  trackerVisible: boolean;
  /**
   * Позволяет "запланировать" скрытие ползунка. Первый вызов делает ползунок видимым, затем через
   * delay миллисекунд скрывает его. Если тайм-аут не успевает сработать, то каждый последующий вызов
   * функции откладывает скрытие ползунка на delay миллисекунд
   */
  queueTrackerVisibility: () => void;
  /**
   * Позволяет изменить видимость ползунка
   * @param isVisible - показать/скрыть
   * @param force - меняет режим форсированного изменения видимости (trackerVisible не будет реагировать на изменения,
   * пока данный режим включен)
   */
  changeTrackerVisiblity: (isVisible: boolean, force?: boolean) => void;
}

/**
 * Хук, который позволяет управлять видимостью ползунка скроллбара.
 * @param hideScrollbar - скрывать ли ползунок скроллбара
 * @param delay - через какое кол-во миллисекунд ползунок скроллбара скрывается
 * @returns Объект, содержащий параметры, которые позволяют управлять видимостью ползунка
 */
export const useTrackerVisibility = (
  hideScrollbar = false,
  delay = 1500
): TrackerVisibilityProps => {
  const [trackerVisible, setTrackerVisible] = React.useState(!hideScrollbar);
  const forcedVisibility = React.useRef(false);
  const isTimerUp = React.useRef(false);

  const timeoutCallback = () => {
    isTimerUp.current = false;
    setTrackerVisible(false);
  };

  const { set: setVisibilityTimeout, clear: clearVisibilityTimeout } =
    useTimeout(timeoutCallback, delay);

  const queueTrackerVisibility = React.useCallback(() => {
    if (forcedVisibility.current) {
      return;
    }
    if (!isTimerUp.current) {
      setTrackerVisible(true);
    }

    isTimerUp.current = true;
    setVisibilityTimeout();
  }, [setVisibilityTimeout]);

  const changeTrackerVisiblity = React.useCallback(
    (isVisible = false, force?: boolean) => {
      if (isTimerUp.current) {
        clearVisibilityTimeout();
        isTimerUp.current = false;
      }
      if (force !== undefined) {
        forcedVisibility.current = force;
      }
      if (forcedVisibility.current && !force) {
        return;
      }
      setTrackerVisible(isVisible);
    },
    [clearVisibilityTimeout]
  );

  return { trackerVisible, queueTrackerVisibility, changeTrackerVisiblity };
};
