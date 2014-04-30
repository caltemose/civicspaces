class Field

  constructor: (@container) ->
    if @container.find('input').length
      @field = @container.find('input')
      if @field.attr('type') is "text"
        @updateEvent = 'blur'
      else
        @updateEvent = 'change'
    else if @container.find('select').length
      @field = @container.find('select')
      @updateEvent = 'change'

    @validation = @field.data('validation-rules') or false
    @field.bind @updateEvent, @checkValue


  checkValue: (event) =>
    @isValid()
    

  isValid: ->
    if !@validation
      @valid = true
    else
      @valid = cs.validator.test @validation, @field
    if @valid
      @container.removeClass().addClass 'has-success'
    else
      @container.removeClass().addClass 'has-error'
    @valid
