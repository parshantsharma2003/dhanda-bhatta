$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outDir = "C:\Users\parsh\.gemini\antigravity\brain\12709ff4-e24a-4e41-bae1-651ce555d62c\visual_verifications\perf_viewports"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force }

$viewports = @(
  @{ name="viewport_360_home"; url="http://localhost:3000/"; width=360; height=780 },
  @{ name="viewport_390_home"; url="http://localhost:3000/"; width=390; height=844 },
  @{ name="viewport_430_home"; url="http://localhost:3000/"; width=430; height=932 },
  @{ name="viewport_768_home"; url="http://localhost:3000/"; width=768; height=1024 },
  @{ name="viewport_1024_home"; url="http://localhost:3000/"; width=1024; height=768 },
  @{ name="viewport_1440_home"; url="http://localhost:3000/"; width=1440; height=900 },
  @{ name="viewport_390_products"; url="http://localhost:3000/products"; width=390; height=844 },
  @{ name="viewport_390_gallery"; url="http://localhost:3000/gallery"; width=390; height=844 }
)

foreach ($v in $viewports) {
  $outPath = Join-Path $outDir ($v.name + ".png")
  $winArg = "--window-size=" + $v.width + "," + $v.height
  $scrArg = "--screenshot=" + $outPath
  Start-Process -FilePath $chrome -ArgumentList @("--headless=new", "--hide-scrollbars", $winArg, $scrArg, $v.url) -Wait
  Write-Host "Verified viewport $($v.width)x$($v.height): $($v.name) -> OK"
}
