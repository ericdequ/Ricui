// =============================================================================
// @ric/ui-core/virtualized-list — small lists stay cheap, big lists virtualize
// =============================================================================
// Upstreamed from BEV src/ui/VirtualizedList. Renders plain markup until the
// list crosses `virtualizeAt`, then upgrades to react-virtuoso's measured
// rendering. react-virtuoso is an OPTIONAL peer dependency — install it in the
// consumer only if you use this component (small lists never need it, but the
// component imports it eagerly, so a consumer that renders VirtualizedList must
// provide it).
// =============================================================================

import { forwardRef, useCallback, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { cx } from './index.js';

const VirtualList = forwardRef(function VirtualList({ children, context, style, ...props }, ref) {
  return (
    <div {...props} ref={ref} className={cx(context?.listClassName)} style={style}>
      {children}
    </div>
  );
});

function VirtualItem({ children, context, ...props }) {
  return (
    <div {...props} className={cx(context?.itemClassName)} role={context?.itemRole}>
      {children}
    </div>
  );
}

function EmptyPlaceholder({ context }) {
  return context?.emptyState || null;
}

const VIRTUOSO_COMPONENTS = { EmptyPlaceholder, Item: VirtualItem, List: VirtualList };
const DEFAULT_INCREASE_VIEWPORT_BY = { top: 240, bottom: 360 };
const DEFAULT_OVERSCAN = { main: 240, reverse: 160 };

const defaultItemKey = (item, index) => item?.id || item?.uid || item?.userId || item?.key || index;

/**
 * VirtualizedList — cheap small-list markup that upgrades to Virtuoso at scale.
 *
 * @param {object} props
 * @param {Array<any>} props.data
 * @param {(item:any, index:number) => import('react').ReactNode} props.renderItem
 * @param {(item:any, index:number) => any} [props.itemKey]
 * @param {string} [props.className] @param {string} [props.listClassName] @param {string} [props.itemClassName]
 * @param {import('react').ReactNode} [props.emptyState]
 * @param {number} [props.virtualizeAt] - List length at which to switch to Virtuoso (default 16).
 * @param {string} [props.virtualHeight] @param {object} [props.virtualStyle]
 * @param {boolean} [props.useWindowScroll] @param {number} [props.defaultItemHeight]
 * @param {number|{top:number,bottom:number}} [props.increaseViewportBy]
 * @param {number|{main:number,reverse:number}} [props.overscan]
 * @param {boolean} [props.alignToBottom] @param {boolean|'auto'|'smooth'|Function} [props.followOutput]
 * @param {number|object} [props.initialTopMostItemIndex]
 * @param {Element|null} [props.customScrollParent]
 * @param {string} [props.role] @param {string} [props.itemRole] @param {string} [props.ariaLabel]
 */
export function VirtualizedList({
  data,
  renderItem,
  itemKey = defaultItemKey,
  className = '',
  listClassName = '',
  itemClassName = '',
  emptyState = null,
  virtualizeAt = 16,
  virtualHeight = '100%',
  virtualStyle = null,
  useWindowScroll = false,
  defaultItemHeight = 72,
  increaseViewportBy = DEFAULT_INCREASE_VIEWPORT_BY,
  overscan = DEFAULT_OVERSCAN,
  alignToBottom = false,
  followOutput = false,
  initialTopMostItemIndex = undefined,
  customScrollParent = null,
  role = 'list',
  itemRole = 'listitem',
  ariaLabel = '',
}) {
  const items = Array.isArray(data) ? data : [];
  const shouldVirtualize = items.length >= Math.max(0, Number(virtualizeAt));
  const getItemKey = useCallback(
    (item, index) => (typeof itemKey === 'function' ? itemKey(item, index) : defaultItemKey(item, index)),
    [itemKey],
  );
  const computeItemKey = useCallback((index, item) => getItemKey(item, index), [getItemKey]);
  const renderVirtualItem = useCallback((index, item) => renderItem(item, index), [renderItem]);
  const context = useMemo(() => ({ emptyState, itemClassName, itemRole, listClassName }), [emptyState, itemClassName, itemRole, listClassName]);
  const style = useMemo(
    () => ({
      ...(virtualHeight == null || customScrollParent ? {} : { height: virtualHeight }),
      ...(virtualStyle || {}),
    }),
    [virtualHeight, virtualStyle, customScrollParent],
  );
  const optionalVirtuosoProps = useMemo(() => {
    const props = {};
    if (initialTopMostItemIndex !== undefined) props.initialTopMostItemIndex = initialTopMostItemIndex;
    if (customScrollParent) props.customScrollParent = customScrollParent;
    return props;
  }, [customScrollParent, initialTopMostItemIndex]);

  if (items.length === 0) return emptyState;

  if (!shouldVirtualize) {
    return (
      <div className={className} role={role || undefined} aria-label={ariaLabel || undefined}>
        <div className={listClassName}>
          {items.map((item, index) => (
            <div key={getItemKey(item, index)} className={itemClassName} role={itemRole || undefined}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Virtuoso
      className={className}
      style={style}
      data={items}
      role={role || undefined}
      aria-label={ariaLabel || undefined}
      components={VIRTUOSO_COMPONENTS}
      context={context}
      computeItemKey={computeItemKey}
      itemContent={renderVirtualItem}
      defaultItemHeight={defaultItemHeight}
      increaseViewportBy={increaseViewportBy}
      overscan={overscan}
      useWindowScroll={useWindowScroll}
      alignToBottom={alignToBottom}
      followOutput={followOutput}
      {...optionalVirtuosoProps}
    />
  );
}
