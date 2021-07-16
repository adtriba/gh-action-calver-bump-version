const { execSync } = require('child_process')
const { Toolkit } = require('actions-toolkit')

// Change directory location if needed
if (process.env.PACKAGEJSON_DIR) {
    process.env.GITHUB_WORKSPACE = `${process.env.GITHUB_WORKSPACE}/${process.env.PACKAGEJSON_DIR}`
    process.chdir(process.env.GITHUB_WORKSPACE)
}

// Core GH Action git logic
Toolkit.run(async (tools) => {
    try {
        const today = new Date()
        const pkg = tools.getPackageJSON()
        const tagPrefix = process.env['INPUT_TAG-PREFIX'] || ''
        const commitMessage = process.env['INPUT_COMMIT-MESSAGE'] || 'ci: version bump to {{version}}'
        const current = pkg.version.toString()
        const currentVersionParts = current.split('-')
        const currentCalVersion = currentVersionParts[0]
        const patchVersion = currentVersionParts[1]
        const calVersion = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`.substring(2)
        const bumpedPatchVersion = !patchVersion || (calVersion != currentCalVersion) ? 0 :  Number(patchVersion) + 1
        const version = calVersion + '-' + bumpedPatchVersion
        let currentBranch = /refs\/[a-zA-Z]+\/(.*)/.exec(process.env.GITHUB_REF)[1]
        let isPullRequest = false

        // Set up Git credentials
        await tools.runInWorkspace('git', [
            'config',
            'user.name',
            `"${process.env.GITHUB_USER || 'Automated Version Bump'}"`,
        ])

        await tools.runInWorkspace('git', [
            'config',
            'user.email',
            `"${process.env.GITHUB_EMAIL || 'gh-action-calver-bump-version@users.noreply.github.com'}"`,
        ])

        // Set up branch
        if (process.env.GITHUB_HEAD_REF) {
            currentBranch = process.env.GITHUB_HEAD_REF
            isPullRequest = true
        }

        if (process.env['INPUT_TARGET-BRANCH']) {
            currentBranch = process.env['INPUT_TARGET-BRANCH']
        }

        await tools.runInWorkspace('npm', ['version', '--allow-same-version=true', '--git-tag-version=false', current])
        let newVersion = execSync(`npm version --git-tag-version=false ${version}`).toString().trim().replace(/^v/, '')

        await tools.runInWorkspace('git', [
            'commit',
            '-a',
            '-m',
            commitMessage.replace(/{{version}}/g, `${tagPrefix}${newVersion}`),
        ])

        // now go to the actual branch to perform the same versioning
        if (isPullRequest) {
            await tools.runInWorkspace('git', ['fetch'])
        }

        await tools.runInWorkspace('git', ['checkout', currentBranch])
        await tools.runInWorkspace('npm', ['version', '--allow-same-version=true', '--git-tag-version=false', current])

        newVersion = execSync(`npm version --git-tag-version=false ${version}`).toString().trim().replace(/^v/, '')

        try {
            // to support "actions/checkout@v1"
            await tools.runInWorkspace('git', [
                'commit',
                '-a',
                '-m',
                commitMessage.replace(/{{version}}/g, `${tagPrefix}${newVersion}`),
            ])
        } catch (e) {
            console.warn(
                'git commit failed because you are using "actions/checkout@v2"; ' +
                    'but that doesnt matter because you dont need that git commit, thats only for "actions/checkout@v1"'
            )
        }

        const remoteRepo = `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`

        if (process.env['INPUT_SKIP-TAG'] !== 'true') {
            await tools.runInWorkspace('git', ['tag', tagPrefix + newVersion])
            await tools.runInWorkspace('git', ['push', remoteRepo, '--follow-tags'])
            await tools.runInWorkspace('git', ['push', remoteRepo, '--tags'])
        } else {
            await tools.runInWorkspace('git', ['push', remoteRepo])
        }
    } catch (e) {
        tools.log.fatal(e)
        tools.exit.failure('Failed to bump version')
    }
    tools.exit.success('Version bumped!')
})
