<#
PowerShell helper: commit, push to origin main, optionally run DB migration.
Usage examples:
  .\scripts\push_and_migrate.ps1 -RemoteUrl 'https://github.com/your/repo.git' -RunMigrate
  .\scripts\push_and_migrate.ps1
#>
param(
  [string]$RemoteUrl = $null,
  [switch]$RunMigrate
)

function Exec($cmd) {
  Write-Host "> $cmd"
  $rc = & cmd /c $cmd
  if ($LASTEXITCODE -ne 0) { throw "Command failed: $cmd" }
  return $rc
}

try {
  Write-Host "Preparing git commit..."
  Exec 'git status --porcelain'
  Exec 'git add .'
  $msg = Read-Host "Commit message (leave empty for default)"
  if ([string]::IsNullOrWhiteSpace($msg)) { $msg = 'Update site: migrations, scripts, and improvements' }
  Exec "git commit -m \"$msg\""

  if (-not (git remote get-url origin 2>$null)) {
    if ($RemoteUrl) {
      Exec "git remote add origin $RemoteUrl"
    } else {
      Write-Host "No remote 'origin' found. Provide -RemoteUrl to add one, or add origin manually and re-run."
      exit 1
    }
  }

  Exec 'git branch -M main'
  Exec 'git push -u origin main'

  if ($RunMigrate) {
    if (-not (Test-Path '.env')) {
      Write-Host ".env not found — migration requires a DATABASE_URL in .env. Create .env and re-run with -RunMigrate."; exit 1
    }
    Write-Host "Installing dependencies..."
    Exec 'npm install'
    Write-Host "Running migration..."
    Exec 'npm run migrate'
  }

  Write-Host "Done."
} catch {
  Write-Error $_.Exception.Message
  exit 1
}
