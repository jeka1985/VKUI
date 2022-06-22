import * as React from "react";
import { classNames } from "../../lib/classNames";
import { usePlatform } from "../../hooks/usePlatform";
import { getClassName } from "../../helpers/getClassName";
import { Text } from "../Typography/Text/Text";
import { Tappable } from "../../components/Tappable/Tappable";
import { hasReactNode } from "../../lib/utils";
import "./MiniInfoCell.css";

export interface MiniInfoCellProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Иконка слева.<br />
   * Рекомендуется использовать иконки размера 20.
   */
  before: React.ReactNode;

  /**
   * Содержимое справа.<br />
   * `<UsersStack size="s" />` или `<Avatar size={24} />`
   */
  after?: React.ReactNode;

  /**
   * Тип ячейки:
   *
   * - `base` – базовая ячейка с серой иконкой и серым текстом.<br />
   * В компонент можно передать `Link`, чтобы визуально сделать часть текста ссылкой.
   * - `add` – тип ячейки, который показывает, что взаимодействие с ней должно вызывать действие добавления чего-то.
   * - `more` – взаимодействие с такой ячейкой должно открывать какую-то подробную информацию.
   */
  mode?: "base" | "add" | "more";

  /**
   * Тип отображения текста:
   *
   * - `nowrap` – в одну строку, текст не переносится и обрезается.
   * - `short` – максимально отображается 3 строки, остальное обрезается.
   * - `full` – текст отображается полностью.
   */
  textWrap?: "nowrap" | "short" | "full";

  /**
   * Стиль текста:
   *
   * - `primary` – используйте этот стиль, если хотите выделить информацию в общем списке.<br />Пример использования: подробная информация на странице сообщества
   * - `secondary` – стиль по-умолчанию.
   */
  textLevel?: "primary" | "secondary";
}

/**
 * @see https://vkcom.github.io/VKUI/#/MiniInfoCell
 */
export const MiniInfoCell: React.FC<MiniInfoCellProps> = ({
  before,
  after,
  mode = "base",
  textWrap = "nowrap",
  textLevel = "secondary",
  children,
  ...restProps
}: MiniInfoCellProps) => {
  const platform = usePlatform();

  const isClickable = !!restProps.onClick;

  return (
    <Tappable
      Component="div"
      disabled={!isClickable}
      role={isClickable ? "button" : undefined}
      {...restProps}
      // eslint-disable-next-line vkui/no-object-expression-in-arguments
      vkuiClass={classNames(
        getClassName("MiniInfoCell", platform),
        {
          [`MiniInfoCell--md-${mode}`]: mode !== "base",
          [`MiniInfoCell--wr-${textWrap}`]: textWrap !== "nowrap",
        },
        `MiniInfoCell--lvl-${textLevel}`
      )}
    >
      <span vkuiClass="MiniInfoCell__icon">{before}</span>
      <Text
        vkuiClass="MiniInfoCell__content"
        weight={mode === "more" ? "2" : undefined}
      >
        {children}
      </Text>
      {hasReactNode(after) && (
        <span vkuiClass="MiniInfoCell__after">{after}</span>
      )}
    </Tappable>
  );
};
