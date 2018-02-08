import StringColumn from '../../model/StringColumn';
import {filterMissingMarkup} from '../missing';
import ADialog, {IDialogContext} from './ADialog';

/** @internal */
export default class StringFilterDialog extends ADialog {

  constructor(private readonly column: StringColumn, dialog: IDialogContext) {
    super(dialog, {
      fullDialog: true
    });
  }

  private updateFilter(filter: string | RegExp | null) {
    this.dialog.attachment.classList.toggle('lu-filtered', filter != null && filter !== '');
    this.column.setFilter(filter);
  }

  reset() {
    this.findInput('input[type="text"]').value = '';
    this.forEach('input[type=checkbox', (n: HTMLInputElement) => n.checked = false);
    this.updateFilter(null);
  }

  submit() {
    const filterMissing = this.findInput('input[type="checkbox"].lu_filter_missing').checked;
    if (filterMissing) {
      this.updateFilter(StringColumn.FILTER_MISSING);
      return true;
    }
    const input = this.findInput('input[type="text"]').value;
    const isRegex = this.findInput('input[type="checkbox"]:first-of-type').checked;
    this.updateFilter(isRegex ? new RegExp(input) : input);
    return true;
  }

  protected build(node: HTMLElement) {
    let bak = this.column.getFilter() || '';
    const bakMissing = bak === StringColumn.FILTER_MISSING;
    if (bakMissing) {
      bak = '';
    }
    node.insertAdjacentHTML('beforeend', `<input type="text" placeholder="containing..." autofocus value="${(bak instanceof RegExp) ? bak.source : bak}" style="width: 100%">
    <label><input type="checkbox" ${(bak instanceof RegExp) ? 'checked="checked"' : ''}>RegExp</label>
    ${filterMissingMarkup(bakMissing)}`);

    const filterMissing = <HTMLInputElement>node.querySelector('input[type="checkbox"].lu_filter_missing');
    const input = <HTMLInputElement>node.querySelector('input[type="text"]');
    const isRegex = <HTMLInputElement>node.querySelector('input[type="checkbox"]:first-of-type');

    const update = () => {
      input.disabled = filterMissing.checked;
      isRegex.disabled = filterMissing.checked;

      if (filterMissing.checked) {
        this.updateFilter(StringColumn.FILTER_MISSING);
        return;
      }
      const valid = input.value.trim();
      filterMissing.disabled = valid.length > 0;
      if (valid.length <= 0) {
        this.updateFilter(null);
        return;
      }
      this.updateFilter(isRegex.checked ? new RegExp(input.value) : input.value);
    };

    filterMissing.onchange = update;
    input.onchange = update;
    isRegex.onchange = update;
  }
}
