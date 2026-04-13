$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$src  = Join-Path $root "revolution2_production.html"

if (-not (Test-Path -LiteralPath $src)) {
  throw "Source file not found: $src"
}

# Read as UTF-8 to preserve characters like "—" and "৳"
$html = Get-Content -Raw -LiteralPath $src -Encoding UTF8

$assetsDir = Join-Path $root "assets"
if (-not (Test-Path -LiteralPath $assetsDir)) {
  New-Item -ItemType Directory -Path $assetsDir | Out-Null
}

# ----------------------------
# Extract CSS
# ----------------------------
$cssMatch = [regex]::Match(
  $html,
  "<style>([\s\S]*?)</style>",
  [Text.RegularExpressions.RegexOptions]::IgnoreCase
)
if (-not $cssMatch.Success) { throw "CSS <style> block not found" }

$css = $cssMatch.Groups[1].Value
Set-Content -LiteralPath (Join-Path $root "styles.css") -Value $css -Encoding UTF8

# ----------------------------
# Extract head content before <style>
# ----------------------------
$headPrefix = [regex]::Match(
  $html,
  "^([\s\S]*?)<style>",
  [Text.RegularExpressions.RegexOptions]::Singleline
).Groups[1].Value

$headInner = [regex]::Match(
  $headPrefix,
  "<head>([\s\S]*?)$",
  [Text.RegularExpressions.RegexOptions]::Singleline
).Groups[1].Value.Trim()

# ----------------------------
# Extract markup between the two scripts
# ----------------------------
$betweenScripts = [regex]::Match(
  $html,
  "</script>\s*([\s\S]*?)\s*<script>\s*`r?`n\s*// ================================================================",
  [Text.RegularExpressions.RegexOptions]::IgnoreCase
)
if (-not $betweenScripts.Success) { throw "Could not locate HTML section between scripts" }
$bodyMarkup = $betweenScripts.Groups[1].Value.Trim()

# ----------------------------
# Extract the main JS (second script block)
# ----------------------------
$mainJsMatch = [regex]::Match(
  $html,
  "<script>\s*(// ================================================================[\s\S]*?)</script>\s*</body>\s*</html>",
  [Text.RegularExpressions.RegexOptions]::IgnoreCase
)
if (-not $mainJsMatch.Success) { throw "Main JS <script> block not found" }

$mainJs = $mainJsMatch.Groups[1].Value
Set-Content -LiteralPath (Join-Path $root "script.js") -Value $mainJs -Encoding UTF8

# ----------------------------
# Extract base64 IMG_* constants from the first script after <body>
# Decode to files, then define constants as paths in assets/assets.js
# ----------------------------
$imgScriptMatch = [regex]::Match(
  $html,
  "<body>\s*<script>([\s\S]*?)</script>",
  [Text.RegularExpressions.RegexOptions]::IgnoreCase
)
if (-not $imgScriptMatch.Success) { throw "First (image) <script> block not found" }

$imgScript = $imgScriptMatch.Groups[1].Value
$imgRe = [regex]'const\s+(IMG_[A-Z0-9_]+)\s*=\s*"data:image/([a-zA-Z0-9+.\-]+);base64,([^"]+)"\s*;'
$imgMatches = $imgRe.Matches($imgScript)
if ($imgMatches.Count -eq 0) { throw "No IMG_* base64 constants found" }

$map = @{}
foreach ($m in $imgMatches) {
  $name = $m.Groups[1].Value
  $ext  = $m.Groups[2].Value
  $b64  = $m.Groups[3].Value

  $bytes = [Convert]::FromBase64String($b64)
  $fileName = ($name.ToLower() + "." + $ext)
  $outPath = Join-Path $assetsDir $fileName
  [IO.File]::WriteAllBytes($outPath, $bytes)

  $map[$name] = ("assets/" + $fileName)
}

$assetsJsPath = Join-Path $assetsDir "assets.js"
$assetsLines = New-Object System.Collections.Generic.List[string]
$assetsLines.Add("// Auto-generated from revolution2_production.html")
$assetsLines.Add("// Image constants preserved as IMG_* names")
foreach ($k in ($map.Keys | Sort-Object)) {
  $assetsLines.Add(("const {0} = ""{1}"";" -f $k, $map[$k]))
}
Set-Content -LiteralPath $assetsJsPath -Value ($assetsLines -join "`r`n") -Encoding UTF8

# ----------------------------
# Build index.html
# ----------------------------
$indexLines = New-Object System.Collections.Generic.List[string]
$indexLines.Add("<!DOCTYPE html>")
$indexLines.Add("<html lang=""en"">")
$indexLines.Add("<head>")
$indexLines.Add($headInner)
$indexLines.Add("<link rel=""stylesheet"" href=""styles.css"">")
$indexLines.Add("</head>")
$indexLines.Add("<body>")
$indexLines.Add("<script src=""assets/assets.js""></script>")
$indexLines.Add($bodyMarkup)
$indexLines.Add("<script src=""script.js""></script>")
$indexLines.Add("</body>")
$indexLines.Add("</html>")

Set-Content -LiteralPath (Join-Path $root "index.html") -Value ($indexLines -join "`r`n") -Encoding UTF8

Write-Host ("Generated index.html, styles.css, script.js, and {0} assets into assets/." -f $imgMatches.Count)

