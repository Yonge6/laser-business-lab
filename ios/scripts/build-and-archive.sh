#!/bin/zsh
set -euo pipefail

ROOT_DIR="${0:A:h:h}"
PROJECT="$ROOT_DIR/MakerBusinessLab.xcodeproj"
ARCHIVE="$ROOT_DIR/build/MakerBusinessLab.xcarchive"

"$ROOT_DIR/../.tools/xcodegen/xcodegen/bin/xcodegen" generate --spec "$ROOT_DIR/project.yml"

xcodebuild \
  -project "$PROJECT" \
  -scheme MakerBusinessLab \
  -configuration Release \
  -destination "generic/platform=iOS" \
  -archivePath "$ARCHIVE" \
  -allowProvisioningUpdates \
  archive

echo "$ARCHIVE"
