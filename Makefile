###############################################################################
MK_INFO := https://pypi.org/project/vmklib
ifeq (,$(shell which mk))
$(warning "No 'mk' in $(PATH), install 'vmklib' with 'pip' ($(MK_INFO))")
endif
ifndef MK_AUTO
$(error target this Makefile with 'mk', not '$(MAKE)' ($(MK_INFO)))
endif
###############################################################################

.PHONY: build edit env server

.DEFAULT_GOAL := host

# Link 'src' to the project directory.
$($(PROJ)_DIR)/src:
	cd $($(PROJ)_DIR) && ln -s $(PROJ) src

env: $(VENV_CONC) $($(PROJ)_DIR)/src

edit: env $(PY_PREFIX)edit

host: env
	npx parcel --no-cache

format: env
	npx eslint --fix $($(PROJ)_DIR)/src
	npx prettier -w $($(PROJ)_DIR)/src

lint: env
	npx eslint $($(PROJ)_DIR)/src
	npx prettier --check $($(PROJ)_DIR)/src

test: env
	npx jest --coverage

test-%: env
	npx jest -t $*

build: env
	npx parcel build

server: env
	$(PYTHON) $($(PROJ)_DIR)/server.py 0.0.0.0 0
