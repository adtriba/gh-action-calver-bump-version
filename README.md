## gh-action-calver-bump-version

GitHub Action for automated npm version bump for CalVer.

> ⚠️ Make sure you use the `actions/checkout@v2` action!

### Usage:
**tag-prefix:** Prefix that is used for the git tag  (optional). Example:
```yaml
- name:  'Automated Version Bump'
  uses:  'adtriba/gh-action-calver-bump-version'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag-prefix:  'v'
```

**skip-tag:** The tag is not added to the git repository  (optional). Example:
```yaml
- name:  'Automated Version Bump'
  uses:  'adtriba/gh-action-calver-bump-version'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    skip-tag:  'true'
```

**PACKAGEJSON_DIR:** Param to parse the location of the desired package.json (optional). Example:
```yaml
- name:  'Automated Version Bump'
  uses:  'adtriba/gh-action-calver-bump-version'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    PACKAGEJSON_DIR:  'frontend'
```

**TARGET-BRANCH:** Set a custom target branch to use when bumping the version. Useful in cases such as updating the version on master after a tag has been set (optional). Example:
```yaml
- name:  'Automated Version Bump'
  uses:  'adtriba/gh-action-calver-bump-version'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    target-branch: 'master'
```

**commit-message:** Set a custom commit message for version bump commit. Useful for skipping additional workflows run on push. Example:
```yaml
- name:  'Automated Version Bump'
  uses:  'adtriba/gh-action-calver-bump-version'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    commit-message: 'CI: bumps version to {{version}} [skip ci]'
```
