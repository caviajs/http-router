define build
	@for package in $(shell ls packages); do\
		npm run build --workspace packages/$${package};\
	done
endef

define npm-install
	npm install

	@for package in $(shell ls packages); do\
		npm install --workspace packages/$${package};\
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

verdaccio-run:
	docker run -it -d --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio

release-local:
	@$(call npm-unpublish, 'http://localhost:4873/')
	@$(call build)
	@$(call npm-publish, 'http://localhost:4873/')

release-major:
	@$(call npm-dump-version, 'major')
	@$(call build)
	@$(call npm-publish, 'https://registry.npmjs.org/')

release-minor:
	@$(call npm-dump-version, 'minor')
	@$(call build)
	@$(call npm-publish, 'https://registry.npmjs.org/')

release-patch:
	@$(call npm-dump-version, 'patch')
	@$(call build)
	@$(call npm-publish, 'https://registry.npmjs.org/')
