define clean
	@for package in $(shell ls packages); do\
		rm -rf packages/$${package}/dist;\
		rm -rf packages/$${package}/node_modules;\
	done
endef

define build
	@for package in $(shell ls packages); do\
		npm run build --workspace packages/$${package};\
	done
endef

define npm-install
	@for package in $(shell ls packages); do\
		npm install --workspace packages/$$package;\
	done
endef

define npm-dump-version
	@for package in $(shell ls packages); do\
		npm version $1 --no-git-tag-version --workspace packages/$${package};\
	done
endef

define npm-publish
	@for package in $(shell ls packages); do\
		npm publish --workspace packages/$$package --registry $1;\
	done
endef

define npm-unpublish
	@for package in $(shell ls packages); do\
		npm unpublish @caviajs/$${package}@$$(cat packages/$${package}/package.json | grep -m 1 version | sed 's/[^0-9.]//g') --force --registry $1;\
	done
endef

install:
	@$(call npm-install)

build:
	@$(call build)

clean:
	@$(call clean)

verdaccio-run:
	docker run -it -d --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio

verdaccio-publish:
	@$(call npm-unpublish, 'http://localhost:4873/')
	@$(call build)
	@$(call npm-publish, 'http://localhost:4873/')

release:
	@$(call npm-dump-version, $$VERSION)
	@$(call build)
	@$(call npm-publish, 'https://registry.npmjs.org/')
