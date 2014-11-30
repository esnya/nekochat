ALL	= css/materialize.css \
	  css/materialize.min.css

MATERIALISE_COMPONENTS = 	sass/components/_buttons.scss \
							sass/components/_cards.scss \
							sass/components/_collapsible.scss \
							sass/components/_color.scss \
							sass/components/_dropdown.scss \
							sass/components/_form.scss \
							sass/components/_global.scss \
							sass/components/_grid.scss \
							sass/components/_icons-material-design.scss \
							sass/components/_materialbox.scss \
							sass/components/_mixins.scss \
							sass/components/_modal.scss \
							sass/components/_navbar.scss \
							sass/components/_normalize.scss \
							sass/components/_prefixer.scss \
							sass/components/_roboto.scss \
							sass/components/_sideNav.scss \
							sass/components/_table_of_contents.scss \
							sass/components/_tabs.scss \
							sass/components/_toast.scss \
							sass/components/_tooltip.scss \
							sass/components/_typography.scss \
							sass/components/_waves.scss

css:	$(ALL)

css/materialize.css:	sass/materialize.scss $(MATERIALISE_COMPONENTS)
css/materialize.min.css:	sass/materialize.scss $(MATERIALISE_COMPONENTS)

css/%.min.css:	sass/%.scss
	sass -t compressed sass/$*.scss $@

css/%.css:	sass/%.scss
	sass sass/$*.scss $@
