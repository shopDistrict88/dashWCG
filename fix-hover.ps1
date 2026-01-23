Get-ChildItem -Path "c:\Users\kjwil\wcgdashboard\src" -Filter "*.css" -Recurse | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw
    $originalContent = $content
    
    # Skip if file already has hover media queries
    if ($content -match "@media \(hover: hover\)") {
        Write-Host "Skipping $($_.Name) - already has hover media queries" -ForegroundColor Yellow
        return
    }
    
    # Pattern to match hover rules with multi-line support
    $pattern = "(?m)^([ \t]*)(\.[\w-]+(?:\s*:\w+)*):hover\s*\{([^\}]+)\}"
    
    $newContent = [regex]::Replace($content, $pattern, {
        param($match)
        $indent = $match.Groups[1].Value
        $selector = $match.Groups[2].Value
        $rules = $match.Groups[3].Value
        
        "@media (hover: hover) and (pointer: fine) {`n$indent$selector:hover {$rules}`n$indent}"
    })
    
    if ($newContent -ne $originalContent) {
        Set-Content -Path $file -Value $newContent -NoNewline
        Write-Host "Updated: $($_.Name)" -ForegroundColor Green
    } else {
        Write-Host "No changes: $($_.Name)" -ForegroundColor Gray
    }
}
