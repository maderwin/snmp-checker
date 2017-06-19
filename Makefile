DATA_PATH=$(CURDIR)/data

APP_PATH=$(CURDIR)/protected
VENDOR_PATH=vendor
PHINX_PATH=$(VENDOR_PATH)/bin/phinx
FRONTEND_PATH=$(APP_PATH)/frontend
FETCH_PATH=$(APP_PATH)/fetch
FRONTEND_BUILD_PATH=$(APP_PATH)/frontend/build

COMPOSER_URL=https://getcomposer.org/composer.phar

all:
	@echo 'you must enter target';

composer-get:
	cd $(APP_PATH); \
	wget $(COMPOSER_URL);

composer-install:
	cd $(APP_PATH); \
	php composer.phar install --no-dev;

composer-update:
	cd $(APP_PATH); \
	php composer.phar update --no-dev;

install-prod: composer-get composer-install phinx-migrate-prod fix-exec
install-test: composer-get composer-install phinx-migrate-test fix-exec
install-dev: composer-get composer-install phinx-migrate-dev phinx-seed-dev frontend-init frontend-build fix-exec

update-prod: composer-install phinx-migrate-prod fix-exec
update-test: composer-install phinx-migrate-test phinx-seed-test fix-exec
update-dev: composer-install phinx-migrate-dev phinx-seed-dev frontend-init frontend-build fix-exec

phinx-migrate-dev:
	cd $(APP_PATH); \
	$(PHINX_PATH) migrate -e development
	
phinx-migrate-test:
	cd $(APP_PATH); \
	$(PHINX_PATH) migrate -e testing
	
phinx-migrate-prod:
	cd $(APP_PATH); \
	$(PHINX_PATH) migrate -e production

phinx-init:
	cd $(APP_PATH); \
	$(PHINX_PATH) init;

phinx-seed-dev:
	cd $(APP_PATH); \
	$(PHINX_PATH) seed:run -e development
	
phinx-seed-test:
	cd $(APP_PATH); \
	$(PHINX_PATH) seed:run -e testing
		
phinx-seed-prod:
	cd $(APP_PATH); \
	$(PHINX_PATH) seed:run -e production

frontend-init:
	cd $(FRONTEND_PATH); \
	npm install

frontend-build:
	cd $(FRONTEND_PATH); \
	npm run build

frontend-copy:
	cd $(FRONTEND_BUILD_PATH); \
	cp -Rf * ../../../

frontend: frontend-build frontend-copy frontend-fix-static

frontend-fix-static:
	sed -i -- 's/\/static/\.\/static/g' index.html

fix-exec:
	cd $(FETCH_PATH); \
	chmod 0755 isp1.sh
	chmod 0666 ip