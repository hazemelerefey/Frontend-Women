$targetDir = "d:\FRONTEND WOMEN\public"
New-Item -ItemType Directory -Force -Path "$targetDir\images"
New-Item -ItemType Directory -Force -Path "$targetDir\videos"
New-Item -ItemType Directory -Force -Path "$targetDir\fonts"

$downloads = @(
    @("https://frontend-w.com/assets/images/png/woman2.webp", "$targetDir\images\woman2.webp"),
    @("https://frontend-w.com/assets/images/png/work2.webp", "$targetDir\images\work2.webp"),
    @("https://frontend-w.com/assets/images/png/trains.webp", "$targetDir\images\trains.webp"),
    @("https://frontend-w.com/assets/images/png/toggle.webp", "$targetDir\images\toggle.webp"),
    @("https://frontend-w.com/assets/images/png/fav.png", "$targetDir\images\fav.png"),
    @("https://frontend-w.com/assets/images/svg/logo.svg", "$targetDir\images\logo.svg"),
    @("https://frontend-w.com/assets/images/svg/mobile_logo.svg", "$targetDir\images\mobile_logo.svg"),
    @("https://frontend-w.com/assets/images/video/work-video2.mp4", "$targetDir\videos\work-video2.mp4"),
    @("https://frontend-w.com/assets/images/video/trains.mp4", "$targetDir\videos\trains.mp4"),
    @("https://frontend-w.com/assets/images/video/toggle.mp4", "$targetDir\videos\toggle.mp4"),
    @("https://frontend-w.com/assets/fonts/Inter/inter-tight-latin-400-normal.woff2", "$targetDir\fonts\inter-tight-latin-400-normal.woff2"),
    @("https://frontend-w.com/assets/fonts/Inter/inter-tight-latin-500-normal.woff2", "$targetDir\fonts\inter-tight-latin-500-normal.woff2"),
    @("https://frontend-w.com/assets/fonts/Inter/inter-tight-latin-600-normal.woff2", "$targetDir\fonts\inter-tight-latin-600-normal.woff2"),
    @("https://frontend-w.com/assets/fonts/Inter/inter-tight-latin-700-normal.woff2", "$targetDir\fonts\inter-tight-latin-700-normal.woff2"),
    @("https://frontend-w.com/assets/fonts/Inter/inter-tight-latin-800-normal.woff2", "$targetDir\fonts\inter-tight-latin-800-normal.woff2"),
    @("https://frontend-w.com/assets/fonts/ibm-plex-sans-medium.ttf", "$targetDir\fonts\ibm-plex-sans-medium.ttf"),
    @("https://frontend-w.com/assets/fonts/IBMPlexMono-Regular.ttf", "$targetDir\fonts\IBMPlexMono-Regular.ttf")
)

foreach ($d in $downloads) {
    Write-Host "Downloading $($d[0])..."
    Invoke-WebRequest -Uri $d[0] -OutFile $d[1]
    $size = (Get-Item $d[1]).Length
    Write-Host "Downloaded $($d[1]) - Size: $size bytes"
}
