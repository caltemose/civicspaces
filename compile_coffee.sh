cd ./public/assets/coffee/classes

echo "building cs.js with coffee"

coffee --join ../../js/cs.js --compile \
  ../cs.global.coffee validator.coffee map.coffee form.coffee field.coffee &
