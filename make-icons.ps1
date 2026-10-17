# Icon generator for the Azkar PWA.
# Generates: 192 (any), 512 (any), 512 maskable (Android), 180 apple-touch (iPhone).
# IMPORTANT: ASCII-only (PowerShell 5.1 reads without BOM).

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root   = $PSScriptRoot
$iconsD = Join-Path $root 'icons'
New-Item -ItemType Directory -Force -Path $iconsD | Out-Null

# brand colors
$cDark = [Drawing.Color]::FromArgb(255, 11, 61, 46)    # #0b3d2e
$cMid  = [Drawing.Color]::FromArgb(255, 18, 82, 63)    # #12523f
$cGold = [Drawing.Color]::FromArgb(255, 212, 175, 55)  # #d4af37
$cGold2= [Drawing.Color]::FromArgb(255, 232, 201, 106) # #e8c96a

function New-BgBrush([int]$s) {
    New-Object Drawing.Drawing2D.LinearGradientBrush(
        (New-Object Drawing.Point(0, 0)), (New-Object Drawing.Point($s, $s)), $cDark, $cMid)
}

function New-GoldBrush([int]$x, [int]$y, [int]$w) {
    New-Object Drawing.Drawing2D.LinearGradientBrush(
        (New-Object Drawing.Point($x, $y)), (New-Object Drawing.Point(($x + $w), ($y + $w))), $cGold, $cGold2)
}

function Add-Star([ Drawing.Drawing2D.GraphicsPath]$p, [double]$cx, [double]$cy, [double]$ro, [double]$ri) {
    for ($k = 0; $k -lt 10; $k++) {
        $ang = [Math]::PI / 5 * $k - [Math]::PI / 2
        $r   = if ($k % 2 -eq 0) { $ro } else { $ri }
        $pt  = New-Object Drawing.PointF([float]($cx + $r * [Math]::Cos($ang)), [float]($cy + $r * [Math]::Sin($ang)))
        if ($k -eq 0) { $p.StartFigure() } else { $p.AddLine($prev, $pt) }
        $prev = $pt
    }
    $p.CloseFigure()
}

function New-SiteIcon {
    param([int]$S, [string]$OutFile, [string]$Mode)   # Mode: circle | square | maskable

    $bmp = New-Object Drawing.Bitmap($S, $S)
    $g   = [Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode   = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    if ($Mode -eq 'circle') { $g.Clear([Drawing.Color]::Transparent) } else { $g.Clear([Drawing.Color]::Transparent) }

    # 1) background
    $bg = New-BgBrush $S
    if ($Mode -eq 'circle') { $g.FillEllipse($bg, 0, 0, [float]$S, [float]$S) }
    else { $g.FillRectangle($bg, 0, 0, [float]$S, [float]$S) }

    # 2) gold ring
    $inset = [Math]::Round($S * 0.055)
    $pen   = New-Object Drawing.Pen($cGold, [float]($S * 0.028))
    if ($Mode -eq 'circle') {
        $g.DrawEllipse($pen, [float]$inset, [float]$inset, [float]($S - 2 * $inset), [float]($S - 2 * $inset))
    }
    elseif ($Mode -ne 'maskable') {
        # rounded-rect ring for the square apple icon
        $rad = $S * 0.22; $w2 = $S - 2 * $inset
        $rp = New-Object Drawing.Drawing2D.GraphicsPath
        $rp.AddArc($inset, $inset, $rad, $rad, 180, 90)
        $rp.AddArc(($inset + $w2 - $rad), $inset, $rad, $rad, 270, 90)
        $rp.AddArc(($inset + $w2 - $rad), ($inset + $w2 - $rad), $rad, $rad, 0, 90)
        $rp.AddArc($inset, ($inset + $w2 - $rad), $rad, $rad, 90, 90)
        $rp.CloseFigure()
        $g.DrawPath($pen, $rp)
    }

    # 3) content scale (maskable keeps art inside the 80% safe zone)
    $k = if ($Mode -eq 'maskable') { 0.72 } else { 1.0 }

    # crescent: outer arc + inner arc
    $Ox = 0.53 * $S; $Oy = 0.50 * $S; $R1 = 0.21 * $k * $S
    $d  = 0.5 * $R1
    $R2 = [Math]::Sqrt($d * $d + $R1 * $R1)
    $O2x = $Ox - $d
    $astart = [Math]::Atan2($R1, $d) * 180 / [Math]::PI

    $path = New-Object Drawing.Drawing2D.GraphicsPath
    $path.AddArc([float]($Ox - $R1), [float]($Oy - $R1), [float](2 * $R1), [float](2 * $R1), [float](-90), [float](180))
    $path.AddArc([float]($O2x - $R2), [float]($Oy - $R2), [float](2 * $R2), [float](2 * $R2), [float]$astart, [float](-2 * $astart))
    $path.CloseFigure()
    $gold = New-GoldBrush ([int]($Ox - $R1)) ([int]($Oy - $R1)) ([int](2 * $R1))
    $g.FillPath($gold, $path)

    # star top-left of crescent
    $star = New-Object Drawing.Drawing2D.GraphicsPath
    Add-Star $star ($Ox - 1.55 * $R1) ($Oy - 1.05 * $R1) ($R1 * 0.34) ($R1 * 0.14)
    $g.FillPath($gold, $star)

    # two small sparkle dots
    $dotR = $S * 0.018
    $g.FillEllipse((New-Object Drawing.SolidBrush($cGold)), [float]($Ox - 1.15 * $R2), [float]($Oy - 1.45 * $R2), [float](2 * $dotR), [float](2 * $dotR))
    $g.FillEllipse((New-Object Drawing.SolidBrush($cGold)), [float]($Ox + 0.9 * $R1), [float]($Oy + 1.5 * $R1), [float](2 * $dotR * 0.8), [float](2 * $dotR * 0.8))

    $bmp.Save($OutFile, [Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Output "[OK] $OutFile ($Mode @ $S px)"
}

New-SiteIcon -S 192 -OutFile (Join-Path $iconsD 'icon-192.png') -Mode circle
New-SiteIcon -S 512 -OutFile (Join-Path $iconsD 'icon-512.png') -Mode circle
New-SiteIcon -S 512 -OutFile (Join-Path $iconsD 'icon-512-maskable.png') -Mode maskable
New-SiteIcon -S 180 -OutFile (Join-Path $iconsD 'apple-touch-icon-180.png') -Mode square
