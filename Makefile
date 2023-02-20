###############################################################################
MK_INFO := https://pypi.org/project/vmklib
ifeq (,$(shell which mk))
$(warning "No 'mk' in $(PATH), install 'vmklib' with 'pip' ($(MK_INFO))")
endif
ifndef MK_AUTO
$(error target this Makefile with 'mk', not '$(MAKE)' ($(MK_INFO)))
endif
###############################################################################

.PHONY: edit env host-coverage server

# Link the project directory to the 'src' directory.
$($(PROJ)_DIR)/$(PROJ):
	cd $($(PROJ)_DIR) && ln -s src $(PROJ)

.DEFAULT_GOAL := host

env: $(VENV_CONC) $($(PROJ)_DIR)/$(PROJ)

edit: env $(PY_PREFIX)edit

host-coverage:
	cd $($(PROJ)_DIR)/coverage/lcov-report && python -m http.server 0

test-%: env
	npx jest -t $*

server: env
	$(PYTHON) $($(PROJ)_DIR)/server.py 0.0.0.0 0
