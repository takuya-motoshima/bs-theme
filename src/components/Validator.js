import $ from 'jquery';
// import Parsley from 'parsleyjs';
import * as lang from '~/i18n/validator/index';

export default class {

  /**
   * @param  {string|HTMLFormElement|jqElement} form
   * @param  {al|ar|bg|ca|cs|da|de|el|en|es|et|eu|fa|fi|fr|he|hr|hu|id|it|ja|ko|lt|lv|ms|nl|no|pl|pt_br|pt_pt|ro|ru|sk|sl|sq|sr|sv|th|tk|tr|ua|uk|ur|zh_cn|zh_tw} locale 
   */
  constructor(form, locale = 'en') {

    // Form element
    if ($.type(form) === 'string' || form instanceof HTMLFormElement) form = $(form);
    else if (!(form instanceof $)) throw new TypeError('Wrong parameter type');
    this.form = form;

    // Submit button
    this.submit = this.form.find('[type="submit"]:first');
    if (!this.submit.length && this.form.attr('id') && $(`[type="submit"][form="${this.form.attr('id')}"]`).length)
      this.submit = $(`[type="submit"][form="${this.form.attr('id')}"]`);

    // Event listener
    this.listeners = {
      submit: () => {},
      fieldSuccess: () => {},
      fieldValidate: () => {}
    };

    // When built with a client program, this Parsley and the client program Parsley are different references.
    // Then Parsley.setLocale does not work, so Parsley defines it in "webpack.ProvidePlugin".
    this.Parsley = window.Parsley;

    // Add password verification
    this.addValidator('password', {
      requirementType: 'string',
      validateString: value => {
        /*
          At least 8 characters long
          At least 1 alphabet letter
          At least 1 special character
          At least 1 numeric character
        */
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-z\d@$!%*?&]{8,}$/i.test(value);
        // /*
        //   At least 8 characters long
        //   At least 1 capital letter
        //   At least 1 lowercase letter
        //   At least 1 special character
        //   At least 1 numeric character
        // */
        // return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test();
      },
      messages: {
        en: 'The password must contain at least one letter, number, and symbol.',
        fr: 'Le mot de passe doit contenir au moins une lettre, un chiffre et un symbole.',
        ja: 'パスワードは英数記号をそれぞれ1文字以上含めてください。',
      }
    });

    // Added verification of input file size
    // e.g. <input type="file" name="file" required data-parsley-max-file-size="42">
    this.addValidator('maxFileSize', {
      requirementType: 'integer',
      validateString: function(_, maxSize, parsleyInstance) {
        const files = parsleyInstance.$element[0].files;
        return files.length != 1  || files[0].size <= maxSize * 1024;
      },
      messages: {
        en: 'This file should not be larger than %s Kb',
        fr: 'Ce fichier est plus grand que %s Kb.',
        ja: 'アップロードできるファイルサイズは%s Kb以下までです。'
      }
    });

    // Initialize form validation
    this.parsley = this.form.parsley({
      inputs: 'input,textarea,select,input[type=hidden],:hidden',
      excluded: 'input[type=button],input[type=submit],input[type=reset],[disabled]',
      errorsContainer: parsleyField => {
        let container = parsleyField.$element.closest('.form-group');
        if (container.hasClass('row')) {
          container = parsleyField.$element.parent();
          if (container.hasClass('input-group')) {
            container = container.parent();
          }
        }
        if (!container.length) container = parsleyField.$element.closest('fieldset');
        return container;
      }
    });

    // Set event
    this.form
      .on('submit', event => {
        event.preventDefault();
        this.isValidForm() && this.listeners.submit(event);
      })
      .on('input', 'input', () => {
        if (!this.submit.length) return;
        if (this.isValidForm()) this.submit.removeClass('disabled');
        else this.submit.addClass('disabled');
      });
    this.parsley
      .on('field:success', event => {
        const $field = $(event.$element);
        this.listeners.fieldSuccess($field.attr('name'), $field);
      })
      .on('field:validate', event => {
        const $field = $(event.$element);
        this.listeners.fieldValidate($field.attr('name'), $field);
      });

    // Set locale
    this.setLocale(locale);
  }

  on(type, listener) {
    this.listeners[type] = listener;
    return this;
  }

  excludeFieldValidation(name, exclude) {
    this.form.find(`[name="${name}"]:first`).attr('data-parsley-excluded', exclude ? 'true' : 'false');
    return this;
  }

  isValidForm() {
    return this.parsley.isValid();
  }

  resetForm() {
    this.form.get(0).reset();
    this.parsley.reset();
    return this;
  }

  getField(name) {
    // Escape selector
    name = name.replace(/[\[\]]/g, '\\$&');
    return this.form.find(`[name=${name}]`).parsley();
  }

  getFormData() {
    return new FormData(this.form.get(0));
  }

  removeFieldError(name, error) {
    this.getField(name).removeError(error);
    return this;
  }

  addFieldError(name, error, message) {
    this.getField(name).addError(error, { message });
    return this;
  }

  disableSubmit() {
    this.submit.prop('disabled', true);
  }

  enableSubmit() {
    this.submit.prop('disabled', false);
  }

  addValidator(name, validator, priority) {
    this.Parsley.addValidator(name, validator, priority);
  }

  setLocale(locale) {
    this.Parsley.addMessages(locale, lang[locale]);
    this.Parsley.setLocale(locale);
  }
}