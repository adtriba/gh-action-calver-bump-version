## gh-action-calver-bump-version

GitHub Action for automated CalVer version bumps for NPM.

> ⚠️ Make sure you use the `actions/checkout@v2` action

### Usage:

#### Prefix tag
```yaml
- name:  'Bump CalVer version'
  uses:  'adtriba/gh-action-calver-bump-version'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag-prefix:  'v'
```

#### Skip tagging
```yaml
- name:  'Bump CalVer version'
  uses:  'adtriba/gh-action-calver-bump-version'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    skip-tag:  'true'
```

#### Target branch
```yaml
- name:  'Bump CalVer version'
  uses:  'adtriba/gh-action-calver-bump-version'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    target-branch: 'feature'
```

#### Commit message
```yaml
- name:  'Bump CalVer version'
  uses:  'adtriba/gh-action-calver-bump-version'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    commit-message: 'Version bump to {{version}}'
```
