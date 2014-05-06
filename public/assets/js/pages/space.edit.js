(function() {
  if (this.cs == null) {
    this.cs = {};
  }

  this.cs.page = {
    init: function() {
      cs.page.initOptionsForm();
      return cs.page.initDescriptionForm();
    },
    initOptionsForm: function() {
      var form;
      form = $('.form-options');
      return cs.sharedMethods.initForm(form);
    },
    initDescriptionForm: function() {
      var form;
      form = $('.form-description');
      return cs.sharedMethods.initForm(form);
    }
  };

  $(document).ready(function() {
    return google.maps.event.addDomListener(window, 'load', cs.page.init);
  });

}).call(this);
