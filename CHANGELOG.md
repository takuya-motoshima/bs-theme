# Changelog

## [0.0.26] - 2020-08-01

- Added Introduction(./getting-started) and API Document(./documentation) to public files

## [0.0.25] - 2020-08-01

- Added alert UI example(./documentation/ui-alerts.html).
- Added card UI example(./documentation/ui-cards.html).
- Added panel UI example(./documentation/ui-panels.html).
- Added General UI example(./documentation/ui-general.html).
- Added icon UI example(./documentation/ui-icons.html).
- Added grid system example(./documentation/ui-grid.html).
- Added tab and accordion example(./documentation/ui-tabs-accordions.html).
- Added tab and accordion example(./documentation/ui-tabs-accordions.html).
- Added typography example(./documentation/ui-typography.html).

## [0.0.24] - 2020-08-01

- Added notification module(./src/components/Notifier.js) and example(./documentation/ui-notifications.html).

## [0.0.23] - 2020-07-30

- Changed to return the processing result of promise after closing it with modal base class.  
- Changed so that the caller can receive the result of OK or cancellation selected modally.
    
    To get whether the OK button or the Cancel button is selected, add the 'data-result="true"' attribute to the [OK] button.  
    Returns "true" if the OK button is selected and "false" if the cancel button or escape key is selected.  

    ```JS
    <div class="modal-container modal-effect-1" id="myModal">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close" type="button" data-dismiss="modal" aria-hidden="true"><span class="mdi mdi-close"></span></button>
        </div>
        <div class="modal-body">
          <div class="text-center">
            <div class="text-success"><span class="modal-main-icon mdi mdi-check"></span></div>
            <h3>Title</h3>
            <p>Message</p>
            <div class="mt-8">
              <button class="btn btn-secondary btn-space" type="button" data-dismiss="modal">Cancel</button>
              <button class="btn btn-success btn-space" type="button" data-dismiss="modal" data-result="true">OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    import { Modal } from 'bs-theme';

    const myModal = new Modal('#myModal');
    const result = await myModal.open();// true or false
    ```

    Also, the result can return any value.  
    For example, if you want to return the submission result of a form in a modal, do the following.  

    ```js
    <div class="modal-container colored-header colored-header-success custom-width modal-effect-9" id="myModal">
      <div class="modal-content">
        <div class="modal-header modal-header-colored">
          <h3 class="modal-title">Title</h3>
          <button class="close modal-close" type="button" data-dismiss="modal" aria-hidden="true"><span class="mdi mdi-close"></span></button>
        </div>
        <div class="modal-body">
          <form id="myForm">
            <div class="form-group">
              <label>Email</label>
              <input class="form-control" type="email" placeholder="username@example.com">
            </div>
            <div class="form-group">
              <label>Name</label>
              <input class="form-control" type="text" placeholder="John Doe">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close" type="button" data-dismiss="modal">Cancel</button>
          <button class="btn btn-success modal-close" type="submit" form="myForm">OK</button>
        </div>
      </div>
    </div>

    import { Modal, $ } from 'bs-theme';

    // A modal that returns the form submission result
    class MyModal extends Modal {
      constructor() {
        super($('#myModal'));
        this.modal.on('submit', 'form', event => {
          event.preventDefault();
          this.resolve('Submit!');
        });
      }
    }
    const myModal = new MyModal();
    const result = await myModal.open();// 'Submit!' or false
    ```

## [0.0.22] - 2020-07-29

- Changelog added to ReadMe.

## [0.0.21] - 2020-07-28

- Fixed a bug that the button text option of confirmation modal was not applied(./src/components/ConfirmModal.js).

## [0.0.20] - 2020-07-28

- Added modal example(./documentation/ui-modals.html).  
- Fixed a bug that set button text failed in confirmation dialog(./src/components/ConfirmModal.js).

## [0.0.19] - 2020-07-28

- Datatable example page added (./documentation/tables-datatables.html).

## [0.0.18] - 2020-07-27

- Align vertical position of horizontal form group (.form-group.row) to baseline.

## [0.0.17] - 2020-07-27

- Removed background color and box shadow of box layout (.bt-boxed-layout).

## [0.0.16] - 2020-07-25

- Optimized primary, success, warning and danger colors.  
- Optimized the validation error color, success color, and error message design.

## [0.0.15] - 2020-07-25

- Optimize the font size of form labels.

## [0.0.14] - 2020-07-25

- Optimize text field height.

## [0.0.13] - 2020-07-24

- Optimized form control and button size.

## [0.0.12] - 2020-07-24

- Change align of horizontal form control label (.col-form-label) from right to left.

## [0.0.11] - 2020-07-23

- Changed to align the label of inline form group (.form-group.row) automatically to the right according to the size of media query.

## [0.0.10] - 2020-07-23

- Removed background color and border bottom of modal header.

## [0.0.9] - 2020-07-23

- Add 1x size to round icon.

## [0.0.8] - 2020-07-23

- Added important option to the font size of round icons.

## [0.0.7] - 2020-07-23

- Add Sass such as round icon.

## [0.0.6] - 2020-07-23

- Add margin bottom to a form group inside a modal.

## [0.0.5] - 2020-07-22

- The header of the confirmation dialog is not used, so it is deleted.

## [0.0.4] - 2020-07-21

- Add dialog base class(DialogBase).

## [0.0.3] - 2020-07-20

- Add custom validation setting method (addValidator) to Validator class.

## [0.0.2] - 2020-07-20

- Change public file.

## [0.0.0] - 2020-07-20

- Trial release.
