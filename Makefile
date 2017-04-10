DATA_PATH=$(CURDIR)/data

APP_PATH=$(CURDIR)/protected
VENDOR_PATH=vendor
PHINX_PATH=$(VENDOR_PATH)/bin/phinx
FRONTEND_PATH=$(APP_PATH)/frontend
FRONTEND_BUILD_PATH=$(APP_PATH)/frontend/build

COMPOSER_URL=https://getcomposer.org/composer.phar

all:
	@echo 'you must enter target';

composer-get:
	cd $(APP_PATH); \
	wget $(COMPOSER_URL);

composer-install: composer-get
	cd $(APP_PATH); \
	php composer.phar install --no-dev;

composer-update:
	cd $(APP_PATH); \
	php composer.phar update --no-dev;

install: composer-install

phinx-migrate:
	cd $(APP_PATH); \
	$(PHINX_PATH) migrate;

phinx-init:
	cd $(APP_PATH); \
	$(PHINX_PATH) init;

phinx-seed:
	cd $(APP_PATH); \
	$(PHINX_PATH) seed:run;

frontend-init:


frontend-build:
	cd $(FRONTEND_PATH); \
	npm run build

frontend-copy:
	cd $(FRONTEND_BUILD_PATH); \
	cp -Rf * ../../../

frontend: frontend-build frontend-copy frontend-fix-static

frontend-fix-static:
	sed -i -- 's/\/static/\.\/static/g' index.html