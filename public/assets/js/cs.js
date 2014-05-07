(function() {
  var Field, Form, Map, Validator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if (this.cs == null) {
    this.cs = {};
  }

  this.cs.sharedMethods = {
    initForm: function(formId) {
      return new Form($(formId));
    },
    initMap: function(mapId, lat, lng, marker, zoom) {
      if (lat == null) {
        lat = Map.defaultLat;
      }
      if (lng == null) {
        lng = Map.defaultLng;
      }
      if (marker == null) {
        marker = null;
      }
      if (zoom == null) {
        zoom = null;
      }
      return cs.map = new Map($(mapId), lat, lng, marker, zoom);
    },
    drawMap: function(lat, lng, marker) {
      if (!!cs.map) {
        return cs.map.redraw(lat, lng, marker);
      }
    },
    setBoundsUpdate: function(callback) {
      return google.maps.event.addListener(cs.map.googlemap, 'bounds_changed', callback);
    }
  };

  this.cs.events = {
    VALIDATION_ERROR: 'validation_error',
    FORM_SUCCESS: 'form_success',
    FORM_FAILURE: 'form_failure',
    SAVE_FIELD: 'save_field'
  };

  Field = (function() {
    function Field(container, autoSave) {
      this.container = container;
      this.autoSave = autoSave;
      this.checkValue = __bind(this.checkValue, this);
      if (!this.container.hasClass('disabled')) {
        if (this.container.find('input').length) {
          this.field = this.container.find('input');
          if (this.field.attr('type') === "text") {
            this.updateEvent = 'blur';
          } else {
            this.updateEvent = 'change';
          }
        } else if (this.container.find('select').length) {
          this.field = this.container.find('select');
          this.updateEvent = 'change';
        } else if (this.container.find('textarea').length) {
          this.field = this.container.find('textarea');
          this.updateEvent = 'blur';
        }
        this.validation = this.field.data('validation') || false;
        this.field.bind(this.updateEvent, this.checkValue);
      } else {
        if (this.container.find('input').length) {
          this.field = this.container.find('input');
        }
        if (this.container.find('select').length) {
          this.field = this.container.find('select');
        }
        this.validation = false;
      }
      this.container.data('field', this);
    }

    Field.prototype.saveField = function() {
      return this.container.trigger(cs.events.SAVE_FIELD);
    };

    Field.prototype.checkValue = function(event) {
      if (this.isValid() && this.autoSave) {
        return this.saveField();
      }
    };

    Field.prototype.isValid = function() {
      if (!this.validation) {
        this.valid = true;
      } else {
        this.valid = cs.validator.test(this.validation, this.field);
      }
      if (this.valid) {
        this.container.removeClass().addClass('has-success');
      } else {
        this.container.removeClass().addClass('has-error');
      }
      return this.valid;
    };

    Field.prototype.getName = function() {
      return this.field.attr('name');
    };

    Field.prototype.getValue = function() {
      if (this.field.attr('type') === 'checkbox') {
        return this.field.is(':checked');
      } else {
        return this.field.val();
      }
    };

    return Field;

  })();

  Form = (function() {
    function Form(container) {
      var id_field, label, labels, _i, _len;
      this.container = container;
      this.handleSubmissionResults = __bind(this.handleSubmissionResults, this);
      this.submitAjax = __bind(this.submitAjax, this);
      this.submit = __bind(this.submit, this);
      this.saveField = __bind(this.saveField, this);
      this.fields = [];
      this.autoSave = this.ajax = false;
      id_field = $('[name="_id"]', this.container);
      if (id_field.length) {
        this._id = id_field.val();
      }
      labels = $('label', this.container);
      if (this.submitBtn == null) {
        this.submitBtn = $('[type="submit"]', this.container);
      }
      if (this.container.data('ajax')) {
        if (this.container.data('ajax-url')) {
          this.ajax = this.container.data('ajax-url');
        }
      }
      if (this.ajax) {
        if (this.submitBtn.length) {
          this.submitBtn.click(this.submitAjax);
        } else {
          this.autoSave = true;
        }
      } else {
        this.submitBtn.click(this.submit);
      }
      for (_i = 0, _len = labels.length; _i < _len; _i++) {
        label = labels[_i];
        this.createField(label);
      }
    }

    Form.prototype.createField = function(label) {
      var $label;
      $label = $(label);
      if ($label.children().length) {
        this.fields.push(new Field($label, this.autoSave));
        if (this.autoSave) {
          return $label.bind(cs.events.SAVE_FIELD, this.saveField);
        }
      }
    };

    Form.prototype.saveField = function(event) {
      var data, field;
      field = $(event.target).data('field');
      data = {
        _id: this._id,
        property: field.getName(),
        value: field.getValue()
      };
      return $.post(this.ajax, data, this.handleSubmissionResults, "json");
    };

    Form.prototype.isValid = function() {
      var field, _i, _len, _ref;
      this.valid = true;
      _ref = this.fields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        this.isValidField(field);
      }
      return this.valid;
    };

    Form.prototype.isValidField = function(field) {
      if (!field.isValid()) {
        return this.valid = false;
      }
    };

    Form.prototype.submit = function(e) {
      if (!this.isValid()) {
        e.preventDefault();
        return this.container.trigger('validation_error');
      }
    };

    Form.prototype.submitAjax = function(e) {
      var field, _i, _len, _ref;
      e.preventDefault();
      if (this.isValid()) {
        this.data = {};
        _ref = this.fields;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          field = _ref[_i];
          this.summarizeField(field);
        }
        console.log(this.data);
        return $.post(this.ajax, this.data, this.handleSubmissionResults, "json");
      } else {
        return this.container.trigger(cs.events.VALIDATION_ERROR);
      }
    };

    Form.prototype.summarizeField = function(field) {
      return this.data[field.getName()] = field.getValue();
    };

    Form.prototype.handleSubmissionResults = function(results) {
      if (results.err) {
        console.log(results.err);
        this.container.trigger(cs.events.FORM_FAILURE);
      }
      if (results.success) {
        return this.container.trigger(cs.events.FORM_SUCCESS);
      }
    };

    return Form;

  })();

  Map = (function() {
    Map.defaultLat = 33.7811643;

    Map.defaultLng = -84.38362970000003;

    Map.defaultZoom = 13;

    function Map(container, lat, lng, marker, zoom) {
      var options;
      if (!zoom) {
        zoom = Map.defaultZoom;
      }
      this.container = $(container);
      this.markers = [];
      options = {
        center: this.makeLatLng(lat, lng),
        zoom: zoom
      };
      this.googlemap = new google.maps.Map(this.container[0], options);
      if (marker) {
        this.addMarker(lat, lng, marker.label, marker.infoHtml);
      }
    }

    Map.prototype.defaults = function() {
      this.defaultLat = 33.7811643;
      this.defaultLng = -84.38362970000003;
      return this.markers = [];
    };

    Map.prototype.initInfoWindow = function() {
      if (!this.infoWindow) {
        return this.infoWindow = new google.maps.InfoWindow({
          content: 'default'
        });
      }
    };

    Map.prototype.addMarker = function(lat, lng, label, infoHtml) {
      var iw, map, marker, options;
      if (label == null) {
        label = 'unlabeled marker';
      }
      this.initInfoWindow();
      options = this.makeMarkerOptions(lat, lng, label);
      marker = new google.maps.Marker(options);
      this.markers.push(marker);
      iw = this.infoWindow;
      map = this.googlemap;
      return google.maps.event.addListener(marker, 'click', function() {
        iw.setContent(infoHtml);
        return iw.open(map, marker);
      });
    };

    Map.prototype.addMarkerBySpace = function(space) {
      var info;
      info = "<p><a href=\"/space/view/" + space._id + "\">" + space.address + "</a><br>\n" + space.city + ", " + space.zip + "</p>";
      return this.addMarker(space.geo.lat, space.geo.lng, space.address, info);
    };

    Map.prototype.removeMarker = function(marker) {
      marker.setMap(null);
      return marker = null;
    };

    Map.prototype.makeMarkerOptions = function(lat, lng, label) {
      var options;
      return options = {
        position: this.makeLatLng(lat, lng),
        map: this.googlemap,
        title: label
      };
    };

    Map.prototype.makeLatLng = function(lat, lng) {
      return new google.maps.LatLng(lat, lng);
    };

    Map.prototype.getBounds = function() {
      return this.googlemap.getBounds();
    };

    Map.prototype.redraw = function(lat, lng, label) {
      var m, _i, _len, _ref;
      if (label == null) {
        label = '';
      }
      if (this.markers.length) {
        _ref = this.markers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          m = _ref[_i];
          this.removeMarker(m);
        }
      }
      this.googlemap.setCenter(this.makeLatLng(lat, lng));
      this.googlemap.setZoom(Map.defaultZoom);
      return this.addMarker(lat, lng, label, label);
    };

    return Map;

  })();

  Validator = (function() {
    function Validator() {
      if (!!this.singleton_instance) {
        return this.singleton_instance;
      }
      this.singleton_instance = this;
    }

    Validator.prototype.test = function(method, input) {
      if (this[method]) {
        return this[method](input);
      } else {
        return this.not_empty(input);
      }
    };

    Validator.prototype.min_password_length = 4;

    Validator.prototype.null_selection = "-1";

    Validator.prototype.not_empty = function(input) {
      return input.val().length > 0;
    };

    Validator.prototype.email = function(input) {
      var val;
      val = input.val();
      return val.match(this.patterns.email) && val.length <= 128;
    };

    Validator.prototype.password = function(input) {
      var val;
      val = input.val();
      return val.length >= this.min_password_length;
    };

    Validator.prototype.name = function(input) {
      return input.val().match(this.patterns.name);
    };

    Validator.prototype.phone = function(input) {
      return input.val().match(this.patterns.phone);
    };

    Validator.prototype.patterns = {
      email: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w0-9a-zA-Z]*\.)+[a-zA-Z]{2,9})$/i,
      name: /^[A-Za-z]([A-Za-z\-\s]{1,24})$/,
      phone: /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/i
    };

    return Validator;

  })();

  this.cs.validator = new Validator();

}).call(this);
