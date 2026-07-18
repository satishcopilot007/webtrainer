$FtpHost = $env:HOSTINGER_FTP_HOST
$FtpUser = $env:HOSTINGER_FTP_USERNAME
$FtpPass = $env:HOSTINGER_FTP_PASSWORD
$LocalPath = "c:\Users\a160071\OneDrive - AmerisourceBergen(ABC)\Documents\Workspace\Trainerment"
$RemotePath = "/public_html"

if ([string]::IsNullOrWhiteSpace($FtpHost) -or [string]::IsNullOrWhiteSpace($FtpUser) -or [string]::IsNullOrWhiteSpace($FtpPass)) {
    throw "Set HOSTINGER_FTP_HOST, HOSTINGER_FTP_USERNAME, and HOSTINGER_FTP_PASSWORD environment variables before running this script."
}

Write-Host "Uploading to Hostinger..." -ForegroundColor Cyan

# Upload function
function Upload-File($Local, $Remote) {
    try {
        $Uri = "ftp://$FtpHost$Remote"
        $Req = [System.Net.FtpWebRequest]::Create($Uri)
        $Req.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $Req.Credentials = New-Object System.Net.NetworkCredential($FtpUser, $FtpPass)
        $Req.UseBinary = $true
        
        $File = [System.IO.File]::OpenRead($Local)
        $Req.ContentLength = $File.Length
        $Stream = $Req.GetRequestStream()
        $File.CopyTo($Stream)
        $Stream.Close()
        $File.Close()
        
        $Response = $Req.GetResponse()
        Write-Host "OK: $Remote" -ForegroundColor Green
        $Response.Close()
    } catch {
        Write-Host "FAIL: $Remote" -ForegroundColor Red
    }
}

# Upload frontend
$FrontendDist = "$LocalPath\frontend\dist"
if (Test-Path $FrontendDist) {
    Get-ChildItem -Path $FrontendDist -Recurse -File | ForEach-Object {
        $Rel = $_.FullName.Substring($FrontendDist.Length).Replace("\", "/").TrimStart("/")
        Upload-File $_.FullName "$RemotePath/$Rel"
    }
}

# Upload backend
$Backend = "$LocalPath\backend-php"
if (Test-Path $Backend) {
    Get-ChildItem -Path $Backend -Recurse -File | Where-Object { $_.Name -ne ".env.example" } | ForEach-Object {
        $Rel = $_.FullName.Substring($Backend.Length).Replace("\", "/").TrimStart("/")
        Upload-File $_.FullName "$RemotePath/api/$Rel"
    }
}

# Upload htaccess
Upload-File "$LocalPath\public_html_htaccess.txt" "$RemotePath/.htaccess"
Upload-File "$LocalPath\api_htaccess.txt" "$RemotePath/api/.htaccess"

Write-Host "Done!" -ForegroundColor Green
