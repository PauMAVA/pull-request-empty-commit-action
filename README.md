# pull-request-empty-commit-action
Create an empty commit in the target PR. This will cause PR checks to be reset.

## Credit
Based on the existing action: https://github.com/velocibear/create-empty-commit/tree/main

## Example usage
You can use the action in your jobs like this:

```
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: PauMAVA/pull-request-empty-commit-action@v1.0.0
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          message: 'The commit message'
          name: 'Dummy User'
          email: 'dummy@example.com'
```

## Inputs

| Input | Required? | Description |
| ----- | --------- | ----------- |
| name | Yes | The commit author name. |
| email | Yes | The commit author email address. |
| message | Yes | The commit message |
| repository | No | The repository where the Issue/PR is found |
| issue_number | No | The PR or Issue number where the commit will be attached |
| github_token | No | The Github token to be used |
| fail_on_error | No | If the action should fail on error [true, false] |

On default the issue `issue_number`, `repository` and `github_token` are infered from the context. If one of the parameters could't be infered the action will fail independent of the `fail_on_error` parameter.

## Outputs
Nothing.
