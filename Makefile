ALL	= css/materialize.css \
	  css/materialize.min.css

css:	$(ALL)

css/materialize.css:	sass/materialize.scss 
	sass sass/materialize.scss css/materialize.css

css/materialize.min.css:	sass/materialize.scss 
	sass -t compressed sass/materialize.scss css/materialize.min.css
