import {ICategoricalStatistics, IStatistics} from '../internal/math';
import {ICategoricalColumn, IDataRow, IGroup, INumberColumn, IGroupMeta} from '../model';
import Column from '../model/Column';
import {IDataProvider} from '../provider';
import DialogManager from '../ui/dialogs/DialogManager';
import {ISequence} from '../internal/interable';

export interface IImposer {
  color?(row: IDataRow | null, valueHint?: number): string | null;
}


/**
 * a cell renderer for rendering a cell of specific column
 */
export interface ICellRenderer {
  /**
   * template as a basis for the update
   */
  readonly template: string;

  /**
   * update a given node (create using the template) with the given data
   * @param node the node to update
   * @param d the data item
   * @param i the order relative index
   * @param group the group this row is part of
   */
  update(node: HTMLElement, d: IDataRow, i: number, group: IGroup, meta: IGroupMeta): void;

  /**
   * render a low detail canvas row
   */
  render?(ctx: CanvasRenderingContext2D, d: IDataRow, i: number, group: IGroup, meta: IGroupMeta): void | boolean;
}

/**
 * a cell renderer for rendering a cell of specific column
 */
export interface IGroupCellRenderer {
  /**
   * template as a basis for the update
   */
  readonly template: string;

  /**
   * update a given node (create using the template) with the given data
   * @param node the node to update
   * @param group the group to render
   * @param rows the data items
   */
  update(node: HTMLElement, group: IGroup, rows: ISequence<IDataRow>, meta: IGroupMeta): void;
}

export interface ISummaryRenderer {
  /**
   * template as a basis for the update
   */
  readonly template: string;

  update(node: HTMLElement, hist: IStatistics | ICategoricalStatistics | null): void;
}


/**
 * context for rendering, wrapped as an object for easy extensibility
 */
export interface IRenderContext {
  /**
   * render a column
   * @param col
   */
  renderer(col: Column, imposer?: IImposer): ICellRenderer;

  /**
   * render a column
   * @param col
   */
  groupRenderer(col: Column, imposer?: IImposer): IGroupCellRenderer;

  summaryRenderer(co: Column, interactive: boolean, imposer?: IImposer): ISummaryRenderer;

  statsOf(col: (INumberColumn | ICategoricalColumn) & Column, unfiltered?: boolean): ICategoricalStatistics | IStatistics | null;

  /**
   * prefix used for all generated id names
   */
  readonly idPrefix: string;

  asElement(html: string): HTMLElement;

  colWidth(col: Column): number;

  readonly provider: IDataProvider;
  readonly dialogManager: DialogManager;
}

export enum ERenderMode {
  CELL, GROUP, SUMMARY
}


export interface ICellRendererFactory {
  readonly title: string;
  readonly groupTitle?: string;
  readonly summaryTitle?: string;

  canRender(col: Column, mode: ERenderMode): boolean;

  create(col: Column, context: IRenderContext, hist: IStatistics | ICategoricalStatistics | null, imposer?: IImposer): ICellRenderer;

  createGroup(col: Column, context: IRenderContext, hist: IStatistics | ICategoricalStatistics | null, imposer?: IImposer): IGroupCellRenderer;

  createSummary(col: Column, context: IRenderContext, interactive: boolean, hist: IStatistics | ICategoricalStatistics | null, imposer?: IImposer): ISummaryRenderer;
}


export default IRenderContext;
