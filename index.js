#!/usr/bin/env node

const core = require("@actions/core");
const { context, getOctokit } = require("@actions/github");

async function run() {
  try {
    const githubToken = core.getInput('github_token');

    const message = getInput('message');
    const email = getInput('email');
    const name = getInput('name');
    
    const fullRepoName = core.getInput('repository') === '' ? context.repository.full_name : core.getInput('repository');
    const [owner, repo] = fullRepoName.split('/');
    const issueNumber =
      core.getInput('issue_number') === ''
        ? context.issue.number
        : parseInt(core.getInput('issue_number'));

    if (!issueNumber) {
      core.setFailed("Cannot infer the target issue parameter!");
      return;
    }

    const client = getOctokit(githubToken);

    const {data} = await client.rest.pulls.get({repo, owner, issueNumber})
    const ref = data?.head?.ref
    const commit_sha = data?.merge_commit_sha

    if (!commit_sha || !ref) {
      throw new Error(`failed to get basic pull_request data. commit_sha: ${commit_sha}, ref: ${ref}`);
    }

    const {
      data: {tree}
    } = await client.rest.git.getCommit({repo, owner, commit_sha})

    if (!tree) {
      throw new Error(`failed to get tree for commit and ref: ${commit_sha}, ref: ${ref}. tree: ${tree}`);
    }

    const {
      data: {sha: newSha}
    } = await client.rest.git.createCommit({
      repo,
      owner,
      parents: [commit_sha],
      tree: tree.sha,
      message,
      author: {email, name}
    })

    await client.rest.git.updateRef({
      repo,
      owner,
      ref: `heads/${ref}`,
      sha: newSha
    });

    core.info(`${newSha}`);
  } catch (e) {
    core.error(e);

    if (core.getInput('fail_on_error') === 'true') {
      core.setFailed(e.message);
    }
  }
}

run();
