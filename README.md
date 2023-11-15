# Dropbox Chooser

## Install

Run `npm i` in the directory

## Add a remote

`block add-remote BASE_ID/BLOCK_ID REMOTE_NAME`

Example: `block add-remote appXQGdiWH8i0Wde5/blkO9RIbtubaS03bZ dev-base`

To find the block ID of an existing extension, click the dropdown icon near the extension name, click "Edit extension." On the popup window that will open, click on "How do I run extensions locally?" Then click continue, and in step 2, after "block init", you will see the base_id/block_id, as in the example above.

Once you have set your remote, you may run the extension with the command:

`block run --remote REMOTE_NAME`

To run the extension without specifying a remote name, find the file in the `.block` folder and rename it removing the part before `remote.json`. Example:

`dev-base.remote.json` would become `remote.json`.

Now, when you run jus `block run`, the `remote.json` file will be selected.

## Release the extension

Set a PAT as API key. The PAT must have permission to install extensions, that is, it must include the scope `block:manage`.

Command: `block set-api-key YOUR_PAT`

Then you may run `block release` to release your extension.

If you want to release to a remote other than the default remote, you must specify its name: `block release --remote REMOTE_NAME`.



