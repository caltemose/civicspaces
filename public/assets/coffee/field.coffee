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
    valid = @isValid()
    if valid
      console.log 'this field is valid'
    else
      console.log 'this field is not valid'

  isValid: ->
    if !@validation
      return true
    else
      valid = cs.validator.test @validation, @field
