/**
 * Created by Samuel Gratzl on 06.09.2017.
 */
import Column, {ICategoricalStatistics, IStatistics} from '../../model/Column';
import {IDataProvider, IDataRow} from '../../provider/ADataProvider';
import {IFilterDialog} from '../../dialogs/AFilterDialog';
import {INumberColumn} from '../../model/NumberColumn';
import {ICategoricalColumn} from '../../model/CategoricalColumn';
import {IDOMRenderContext} from '../../renderer/RendererContexts';
import {IGroup} from '../../model/Group';

export interface IRankingHeaderContextContainer {
  readonly idPrefix: string;
  provider: IDataProvider;
  linkTemplates: string[];

  searchAble(col: Column): boolean;

  autoRotateLabels: boolean;
  filters: { [type: string]: IFilterDialog };

  statsOf(col: (INumberColumn | ICategoricalColumn) & Column): ICategoricalStatistics | IStatistics | null;
}

export interface IGroupItem extends IDataRow {
  group: IGroup;
  relativeIndex: number;
}

export interface IGroupData extends IGroup {
  rows: IDataRow[];
}

export function isGroup(item: IGroupData | IGroupItem): item is IGroupData {
  return (<IGroupData>item).name !== undefined; // use .name as separator
}

export interface IRankingBodyContext extends IRankingHeaderContextContainer, IDOMRenderContext {
  isGroup(index: number): boolean;

  getGroup(index: number): IGroupData;

  getRow(index: number): IGroupItem;
}

export declare type IRankingHeaderContext = Readonly<IRankingHeaderContextContainer>;

export declare type IRankingContext = Readonly<IRankingBodyContext>;
