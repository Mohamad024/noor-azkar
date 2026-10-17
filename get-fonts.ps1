# Downloads Google Fonts locally so the site works fully offline (no service worker).
# IMPORTANT: ASCII-only (PowerShell 5.1 reads without BOM).

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$fontsD = Join-Path $root 'fonts'
New-Item -ItemType Directory -Force -Path $fontsD | Out-Null

$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
$cssUrl = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Reem+Kufi:wght@400;500;600;700&family=Amiri+Quran&display=swap'

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$css = (Invoke-WebRequest -Uri $cssUrl -Headers @{ 'User-Agent' = $ua } -UseBasicParsing).Content

# unique woff2 urls in the css
$urls = [regex]::Matches($css, 'https://fonts\.gstatic\.com/[^)]+?\.woff2') |
        ForEach-Object { $_.Value } | Select-Object -Unique

$i = 0
foreach ($u in $urls) {
    $i++
    $name = "font_$i.woff2"
    Invoke-WebRequest -Uri $u -Headers @{ 'User-Agent' = $ua } -OutFile (Join-Path $fontsD $name) -UseBasicParsing
    # rewrite the css to point at the local file (fonts.css lives inside fonts/)
    $css = $css.Replace(($u + ')'), ($name + ')'))
    Write-Output "[OK] $name  ($([Math]::Round((Get-Item (Join-Path $fontsD $name)).Length/1KB)) KB)"
}

[IO.File]::WriteAllText((Join-Path $fontsD 'fonts.css'), $css, (New-Object Text.UTF8Encoding $false))
Write-Output "[OK] fonts/fonts.css written with $($urls.Count) local font files"
