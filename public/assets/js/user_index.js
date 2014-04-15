var cs = cs || {};
cs.contactinfo = {
  submit: null,
  nameField: null,
  emailField: null,
  phoneField: null,
  submitClick: function(e) {
    //console.log('cs.contactinfo.submitClick');
    e.preventDefault();
    var update = false;
    if (cs.contactinfo.nameField.val() != cs.contactinfo.nameField.data('bak'))
      update = true;
    if (cs.contactinfo.phoneField.val() != cs.contactinfo.phoneField.data('bak'))
      update = true;
    if (update) {
      var postData = {
        name: cs.contactinfo.nameField.val(),
        id: cs.contactinfo.emailField.val(),
        phone: cs.contactinfo.phoneField.val()
      }
      $.post('/api/user/update', postData, function(results) {
        if (results.err) console.log(results.err);
        if (results.success) {
          console.log('success updating user: ' + cs.contactinfo.emailField.val());
        }
      }, "json");
    }
  },
  submitInit: function(name) {
    //console.log('cs.contactinfo.submitInit()', name);
    var form = $('#' + name);
    if (!cs.contactinfo.emailField)
      cs.contactinfo.emailField = $('[name="email"]', form);

    if (!cs.contactinfo.nameField)
      cs.contactinfo.nameField = $('[name="name"]', form);
    cs.contactinfo.nameField.data('bak', cs.contactinfo.nameField.val())
    
    if (!cs.contactinfo.phoneField)
      cs.contactinfo.phoneField = $('[name="phone"]', form);
    cs.contactinfo.phoneField.data('bak', cs.contactinfo.phoneField.val())
    
    if (!cs.contactinfo.submit)
      cs.contactinfo.submit = $('[type="submit"]', form);
    cs.contactinfo.submit.click(cs.contactinfo.submitClick);

    console.log('stored values: ');
    console.log(cs.contactinfo.nameField.data('bak'));
    console.log(cs.contactinfo.phoneField.data('bak'));
    
  }
};

$(document).ready(function(){
  cs.contactinfo.submitInit('contactinfo');
});