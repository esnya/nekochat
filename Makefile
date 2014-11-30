ALL	= css/materialize.css \
	  css/materialize.min.css

css:	$(ALL)

css/%.min.css:	sass/%.scss
	sass -t compressed $^ $@

css/%.css:	sass/%.scss
	sass $^ $@
