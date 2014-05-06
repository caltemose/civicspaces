class Field

  # @TODO Implement/improve Field status watching and display updating.
  # check/update on all appropriate events
  # field shows 'edited' status (blurred or not) which is
  # then updated to 'saved' status on AJAX callback success

  constructor: (@container, @autoSave) ->
    # @TODO fix this if/then mess -- switch?
    if !@container.hasClass 'disabled'
      if @container.find('input').length
        @field = @container.find('input')
        if @field.attr('type') is "text"
          @updateEvent = 'blur'
        else
          @updateEvent = 'change'
      else if @container.find('select').length
        @field = @container.find('select')
        @updateEvent = 'change'
      else if @container.find('textarea').length
        @field = @container.find('textarea')
        @updateEvent = 'blur'
      @validation = @field.data('validation') or false
      @field.bind @updateEvent, @checkValue
    else
      if @container.find('input').length
        @field = @container.find('input')
      if @container.find('select').length
        @field = @container.find('select')
      @validation = false

    @container.data 'field', @


  saveField: ->
    @container.trigger cs.events.SAVE_FIELD


  checkValue: (event) =>
    if @isValid() and @autoSave
      @saveField()
    

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


  getName: ->
    @field.attr 'name'


  getValue: ->
    if @field.attr('type') is 'checkbox'
      return @field.is ':checked'        
    else
      @field.val()

    
