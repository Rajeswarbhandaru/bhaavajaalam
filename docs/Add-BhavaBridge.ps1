# Add-BhavaBridge.ps1
# Adds bhava-bridge.js include to all game HTML files in docs/
# Run from E:\bhaavajaalam-main\
# Usage: .\Add-BhavaBridge.ps1

$docsPath = "E:\bhaavajaalam-main\docs"
$bridgeLine = '<script src="bhava-bridge.js"></script>'
$sessionLine = '<script src="bhava-session.js"></script>'

# Files to SKIP (not game files — they have their own logic)
$skipFiles = @(
  "index.html",
  "bhava-setup.html",
  "bhava-student-report.html",
  "bhava-student-import.html",
  "bhava-parent-report.html"
)

$files = Get-ChildItem -Path $docsPath -Filter "*.html" |
         Where-Object { $skipFiles -notcontains $_.Name }

$patched = 0
$skipped = 0

foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw -Encoding UTF8

  # Skip if bridge already added
  if ($content -match "bhava-bridge\.js") {
    Write-Host "  [SKIP] $($file.Name) — already has bridge" -ForegroundColor Gray
    $skipped++
    continue
  }

  # Only patch files that use bhava-session.js
  if ($content -notmatch "bhava-session\.js") {
    Write-Host "  [SKIP] $($file.Name) — no bhava-session" -ForegroundColor Gray
    $skipped++
    continue
  }

  # Insert bridge BEFORE bhava-session.js
  $newContent = $content -replace [regex]::Escape($sessionLine), "$bridgeLine`n$sessionLine"

  if ($newContent -ne $content) {
    Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8 -NoNewline
    Write-Host "  [OK]   $($file.Name)" -ForegroundColor Green
    $patched++
  } else {
    Write-Host "  [WARN] $($file.Name) — session line not found exactly" -ForegroundColor Yellow
    $skipped++
  }
}

Write-Host ""
Write-Host "Done. Patched: $patched  |  Skipped: $skipped" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Copy bhava-bridge.js to E:\bhaavajaalam-main\docs\" -ForegroundColor White
Write-Host "  2. Run: npx cap sync android" -ForegroundColor White
Write-Host "  3. Open Android Studio and build APK" -ForegroundColor White
