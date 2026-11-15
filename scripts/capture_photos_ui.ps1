$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outDir = "C:\Users\parsh\.gemini\antigravity\brain\12709ff4-e24a-4e41-bae1-651ce555d62c\visual_verifications"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force }

$pages = @(
  @{ name="products_mobile"; url="http://localhost:3000/products"; width=390; height=844 },
  @{ name="products_desktop"; url="http://localhost:3000/products"; width=1280; height=800 },
  @{ name="detail_first_class_mobile"; url="http://localhost:3000/products/first-class-red-bricks"; width=390; height=844 },
  @{ name="gallery_mobile"; url="http://localhost:3000/gallery"; width=390; height=844 },
  @{ name="about_stages_mobile"; url="http://localhost:3000/about"; width=390; height=844 },
  @{ name="delivery_mobile"; url="http://localhost:3000/delivery"; width=390; height=844 },
  @{ name="homepage_mobile"; url="http://localhost:3000/"; width=390; height=844 }
)

foreach ($p in $pages) {
  $outPath = Join-Path $outDir ($p.name + ".png")
  $winArg = "--window-size=" + $p.width + "," + $p.height
  $scrArg = "--screenshot=" + $outPath
  Start-Process -FilePath $chrome -ArgumentList @("--headless=new", $winArg, $scrArg, $p.url) -Wait
  Write-Host "Captured: $($p.name) -> $outPath"
}
