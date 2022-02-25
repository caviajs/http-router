define build
	npm run build
endef

define npm-dump-version
	npm version $1 --no-git-tag-version
endef

define npm-publish
	npm run bootstrap
	npm run build
	lerna publish --registry $1
endef

define npm-unpublish
	npm unpublish @caviajs/storage@$(shell cat package.json | grep -m 1 version | sed 's/[^0-9.]//g') --registry $1 || true
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
