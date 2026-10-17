# Snapshot saver for the Azkar site.
# Usage:  .\save-snapshot.ps1 "short description of the change"
# Example: .\save-snapshot.ps1 "add night athkar section"
# IMPORTANT: this file must stay ASCII-only (PowerShell 5.1 reads it without BOM).

$ErrorActionPreference = 'Stop'
$root  = $PSScriptRoot
$stamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$desc  = if ($args.Count -gt 0) { $args[0] } else { 'unnamed change' }

# sanitize description for a folder name
$slug = ($desc -replace '[\\/:*?"<>|]', '-').Trim()

$dest = Join-Path $root ("_snapshots\v_" + $stamp + "_" + $slug)
New-Item -ItemType Directory -Force -Path $dest | Out-Null

foreach ($f in @('index.html', 'styles.css', 'app.js', 'manifest.webmanifest', 'CHANGELOG.md', 'save-snapshot.ps1', 'make-icons.ps1', 'get-fonts.ps1')) {
    if (Test-Path (Join-Path $root $f)) { Copy-Item (Join-Path $root $f) -Destination $dest -Force }
}
foreach ($d in @('icons', 'fonts')) {
    if (Test-Path (Join-Path $root $d)) { Copy-Item (Join-Path $root $d) -Destination $dest -Recurse -Force }
}

# utf8 changelog entry (byte-safe to avoid encoding issues)
$comment = "`n## snapshot $stamp" + "`n**desc:** $desc" + "`n**folder:** _snapshots/" + (Split-Path -Leaf $dest) + "`n"
$changelog = Join-Path $root 'CHANGELOG.md'
[IO.File]::AppendAllText($changelog, $comment, [Text.Encoding]::UTF8)

Write-Output "[OK] snapshot saved to: _snapshots/$(Split-Path -Leaf $dest)"
Write-Output "[OK] entry appended to CHANGELOG.md"
