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
import { Template } from 'js-shared';

export default class {

  /**
   * @param  {string|HTMLTableElement|jqElement} table
   * @param  {Object} option
   */
  constructor(table, option = {}) {
    // option
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
      lengthMenu: undefined,
      template: undefined // Table row template ID selector
    }, option);

    // Table element
    if ($.type(table) === 'string' || table instanceof HTMLTableElement) table = $(table);
    else if (!(table instanceof $)) throw new TypeError('Wrong parameter type');
    this.table = table;

    // Set locale
    option.language = lang[option.lang];
    delete option.lang;

    // Number of page numbers displayed
    $.fn.DataTable.ext.pager.numbers_length = 4;

    // Table row template
    if (option.template) {
      this.template = Template.compile($(option.template).html());
      if (!this.template.length) throw new Error('Table row not found');
    }

    // Initialize data table
    this.dt = table.DataTable(option);
  }

  /**
   * @param {Object} set
   * @return {this}
   */
  addRow(set) {
    const row = $(this.template(set));
    this.dt.row.add(row).draw();
    return this;
  }
  // addRow(row) {
  //   if (!(row instanceof jQuery)) row = $(row);
  //   this.dt.row.add(row).draw();
  //   return this;
  // }

  /**
   * @param  {HTMLTableRowElement|jqElement} row Table row element
   * @param  {Objext} set
   * @return {this}
   */
  updateRow(row, set) {
    if (!(row instanceof jQuery)) row = $(row);
    const dtRow = this.dt.row(row.get(0));
    set = $(this.template(set)).find('td').map((i, column) => column.innerHTML).get();
    dtRow.data(set).draw();
    return this;
  }
  // updateRow(row, set) {
  //   if (!(row instanceof jQuery)) row = $(row);
  //   const dtRow = this.dt.row(row.get(0));
  //   if ($.isPlainObject(set)) set = Object.assign(dtRow.data(), set);
  //   else if (typeof set === 'string') set = $(set).find('td').map((i, column) => column.innerHTML).get();
  //   dtRow.data(set).draw();
  //   return this;
  // }

  /**
   * @param  {HTMLTableRowElement|jqElement} row Table row element
   * @return {this}
   */
  async deleteRow(row) {
    await new Promise(resolve => {
      if (!(row instanceof jQuery)) row = $(row);
      row.fadeOut(400, () => {
        this.dt.row(row).remove().draw();
        resolve();
      });
    });
    return this;
  }

  /**
   * @param  {HTMLTableRowElement|jqElement} row Table row element
   * @param  {number|undefined} index Cell position number
   * @return {Object|string}
   */
  getRowData(row, index = undefined) {
    if (!(row instanceof jQuery)) row = $(row);
    const data = this.dt.row(row.get(0)).data();
    return index !== undefined ? data[index] : data;
  }
}