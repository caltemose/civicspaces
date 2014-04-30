class Form

  constructor: (@container) ->
    @fields = []
    labels = $ 'label', @container
    @createField label for label in labels
    @submitBtn ?= $ '[type="submit"]', @container
    if @submitBtn
      @submitBtn.click @submit

  createField: (label) ->
    @fields.push new Field $ label

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



