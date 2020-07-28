import $ from 'jquery';
// Make it available globally as it needs to be accessible within the single file components (.vue)
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-responsive';
import 'datatables.net-responsive-bs4';
import 'datatables.net-buttons/js/buttons.colVis.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.flash.min.js';
import 'datatables.net-buttons-bs4';
import 'datatables.net-fixedcolumns';
import 'datatables.net-fixedheader';
import * as lang from '~/i18n/datatable/index';

export default class {

  constructor(table, option = {}) {
    option = $.extend({
      lang: 'en',
      responsive: true,
      columnDefs: undefined,
      buttons: [],
      // buttons: [ 'copy', 'csv', 'excel', 'pdf', 'print' ],
      order: undefined,
      dom: "<'row bt-datatable-header'<'col-sm-6'f><'col-sm-6 text-right'B>><'row bt-datatable-body'<'col-sm-12'tr>><'row bt-datatable-footer'<'col-sm-5'i><'col-sm-7'p>>",
      // dom: "<'row bt-datatable-header'<'col-sm-6'l><'col-sm-6'f>><'row bt-datatable-body'<'col-sm-12'tr>><'row bt-datatable-footer'<'col-sm-5'i><'col-sm-7'p>>",
      pageLength: 50,
      lengthMenu: undefined
    }, option);
    if ($.type(table) === 'string' || table instanceof HTMLTableElement) table = $(table);
    else if (!(table instanceof $)) throw new TypeError('Wrong parameter type');
    option.language = lang[option.lang];
    delete option.lang;
    $.fn.DataTable.ext.pager.numbers_length = 4;
    this.dt = table.DataTable(option);
  }

  addRow($row) {
    if (!($row instanceof jQuery)) $row = $($row);
    this.dt.row.add($row).draw();
    return this;
  }

  updateRow($row, set) {
    if (!($row instanceof jQuery)) $row = $($row);
    const row = this.dt.row($row.get(0));
    if ($.isPlainObject(set)) set = Object.assign(row.data(), set);
    else if (typeof set === 'string') set = $(set).find('td').map((i, element) => element.innerHTML).get();
    row.data(set).draw();
    return this;
  }

  async deleteRow($row) {
    if (!($row instanceof jQuery)) $row = $($row);
    await new Promise(resolve => {
      $row.fadeOut(400, () => {
        this.dt.row($row).remove().draw();
        resolve();
      });
    });
    return this;
  }

  getRowData($row, index) {
    if (!($row instanceof jQuery)) $row = $($row);
    const rowData = this.dt.row($row.get(0)).data();
    return index ? rowData[index] : rowData;
  }
}