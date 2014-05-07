class Form

  constructor: (@container) ->
    @fields = []
    @autoSave = @ajax = false
    
    id_field = $ '[name="_id"]', @container
    if id_field.length
      @_id = id_field.val()
    # else
    #   console.log '!! this form is missing an _id field'
    #   console.log @container
    #   return

    labels = $ 'label', @container
    @submitBtn ?= $ '[type="submit"]', @container
    if @container.data 'ajax'
      if @container.data 'ajax-url'
        @ajax = @container.data 'ajax-url'
    if @ajax
      if @submitBtn.length
        @submitBtn.click @submitAjax
      else
        @autoSave = true
    else
      @submitBtn.click @submit

    @createField label for label in labels
        

  createField: (label) ->
    $label = $ label
    # @TODO Stop using <label> for styling purposes only and the check below won't be necessary
    if $label.children().length
      @fields.push new Field $label, @autoSave
      if @autoSave
        $label.bind cs.events.SAVE_FIELD, @saveField

  saveField: (event) =>
    field = $(event.target).data 'field'
    data =
      _id: @_id
      property: field.getName()
      value: field.getValue()

    $.post @ajax, data, @handleSubmissionResults, "json"

  isValid: ->
    @valid = true
    @isValidField field for field in @fields
    @valid

  isValidField: (field) ->
    if !field.isValid()
      @valid = false

  submit: (e) =>
    unless @isValid()
      e.preventDefault()
      @container.trigger 'validation_error'

  submitAjax: (e) =>
    # @TODO submit data only if some data has changed
    e.preventDefault()

    if @isValid()
      @data = {}
      @summarizeField field for field in @fields
      console.log @data
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
    
  