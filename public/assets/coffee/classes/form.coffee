class Form

  constructor: (@container) ->
    @fields = []
    labels = $ 'label', @container
    @createField label for label in labels
    @submitBtn ?= $ '[type="submit"]', @container
    if @container.data 'ajax'
      if @container.data 'ajax-url'
        @ajax = @container.data 'ajax-url'
    if @ajax
      if @submitBtn
        @submitBtn.click @submitAjax
      else
        console.log 'config field auto-saving for Field instances'
    else
      @submitBtn.click @submit
        

  createField: (label) ->
    # unless label.className is 'disabled'
    @fields.push new Field $ label

  isValid: ->
    @valid = true
    @isValidField field for field in @fields
    @valid

  isValidField: (field) ->
    if !field.isValid()
      @valid = false

  submit: (e) =>
    # console.log 'submit:', @isValid()
    unless @isValid()
      e.preventDefault()
      @container.trigger 'validation_error'

  submitAjax: (e) =>
    # @TODO submit data only if some data has changed
    e.preventDefault()

    if @isValid()
      @data = {}
      @summarizeField field for field in @fields
      $.post @ajax, @data, @handleSubmissionResults, "json"

    else
      @container.trigger cs.events.VALIDATION_ERROR
    
  summarizeField: (field) ->
    @data[field.getName()] = field.getValue()

  handleSubmissionResults: (results) =>
    if results.err
      console.log results.err
      @container.trigger cs.events.FORM_FAILURE
    if results.success
      @container.trigger cs.events.FORM_SUCCESS
    
  