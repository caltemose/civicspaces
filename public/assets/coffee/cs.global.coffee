@cs ?= {}

@cs.sharedMethods =

  initForm: (formId) ->
    form = new Form $ formId
