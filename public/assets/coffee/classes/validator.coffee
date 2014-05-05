class Validator
  
  constructor: ()->
    return @singleton_instance unless !@singleton_instance
    @singleton_instance = @

  test: (method,input)->
    if @[method]
      return @[method] input
    else
      return @not_empty input

  null_selection: "-1"

  #================================================ methods:

  not_empty: (input) ->
    input.val().length > 0
  
  email: (input) ->
    val = input.val()
    val.match(@patterns.email) and val.length <= 128    

  password: (input) ->
    val = input.val()
    val.length >= 4

  name: (input) ->
    input.val().match @patterns.name

  phone: (input) ->
    input.val().match @patterns.phone


  # checked: (input) ->
  #   input.prop 'checked'

  # name: (input) ->
  #   input.val().replace(/[\s]+/," ").replace(/\s$/, "").match @patterns.name


  # optional_phone: (input) ->
  #   input.prop("disabled") or input.val() is "" or @phone input

  # city: (input) ->
  #   input.val().replace(/[\s]+/," ").replace(/\s$/, "").match @patterns.city

  # zip_code: (input) ->
  #   input.val().match @patterns.zip_code

  #================================================ regular expressions:
  patterns: 

    email: /// ^ # start regular expression
      (
      [0-9a-zA-Z]
      ([-.\w]*[0-9a-zA-Z])*
      @([0-9a-zA-Z][-\w0-9a-zA-Z]*\.)+
      [a-zA-Z]{2,9}
      )
      $ ///i            #end of line and ignore case

    name: ///^
      [A-Za-z]([A-Za-z\-\s]{1,24})
      $///

    phone: /// ^ #this allows various common formats
      \D?
      (\d{3})
      \D?\D?
      (\d{3})
      \D?
      (\d{4})
      $ ///i 

    # zip_code: /// ^ # start regular expression
    #   ([0-9]{5,5})
    #   $ ///i            #end of line and ignore case

@cs.validator = new Validator() 
