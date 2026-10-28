# Whittle for Mac

Whittle your Mac down to what matters.

Whittle finds caches, logs, build files and other things your Mac can let go, and moves what you choose to the Trash. It also shows large and old files, duplicates, similar photos, app leftovers and login items, and keeps an eye on CPU, memory, disks, network and battery from the menu bar.

## Download

**[Download the latest version](https://github.com/hystericmoon/whittle-releases/releases/latest)**: open the release and download `Whittle-<version>.dmg`.

Requires macOS 26 Tahoe or later.

## Install

1. Open the DMG and drag Whittle to Applications.
2. Open Whittle. macOS says it can't check it for malicious software. Click **Done**.
3. Open System Settings › Privacy & Security, scroll to Security, and click **Open Anyway** next to "Whittle was blocked". Confirm with your password or Touch ID.

Whittle isn't notarized by Apple yet, so macOS asks for this once per download. If Whittle bounces in the Dock and doesn't open, restart your Mac and open it again.

## Full Disk Access

macOS keeps some folders private, such as other apps' data, Mail and Safari. To include the caches and logs inside them, turn on Whittle in System Settings › Privacy & Security › Full Disk Access. Whittle still works without it, and lists what it couldn't read.

## How Whittle treats your files

- Everything Whittle cleans goes to the Trash, so you can put it back. History can undo a cleanup.
- Only items known to be safe are ticked for you. Your documents, photos, music and movies are never ticked.
- Space is freed when you empty the Trash. Whittle can empty it for you, always after asking first.

## Questions and problems

Open an [issue](https://github.com/hystericmoon/whittle-releases/issues).
