# =====================================================
# PreReqs
# =====================================================
# Create an App Registration (e.g. "Intune HWID Upload")
#
# Grant the following API permissions (Application type):
#   • DeviceManagementConfiguration.ReadWrite.All
#   • DeviceManagementServiceConfig.ReadWrite.All
#
# Then grant **Admin Consent**.
#
# =====================================================
# Vars
# =====================================================
#Define Variables
$TenantID          = "YOUR_TENANT_ID"
$ApplicationID     = "YOUR_APP_ID"
$ApplicationSecret = "YOUR_APP_SECRET"
# Optional Group Tag (leave empty "" if not needed)
$GroupTag          = ""

# --- Setup ---
# Keep execution policy change scoped to this session
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Trust PSGallery so Install-Script won't prompt
Set-PSRepository -Name "PSGallery" -InstallationPolicy Trusted -ErrorAction SilentlyContinue

# Ensure the NuGet provider exists (best-effort, non-fatal if already present)
try {
    if (-not (Get-PackageProvider -Name NuGet -ErrorAction SilentlyContinue)) {
        Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force -Scope CurrentUser
    }
} catch { }

# Install Get-WindowsAutopilotInfo if missing (CurrentUser scope; no elevation needed)
if (-not (Get-Command Get-WindowsAutoPilotInfo -ErrorAction SilentlyContinue)) {
    Install-Script -Name Get-WindowsAutoPilotInfo -Force -Scope CurrentUser
}

# --- Run ---
$Args = @(
    '-Online',
    '-TenantId',  $TenantID,
    '-AppId',     $ApplicationID,
    '-AppSecret', $ApplicationSecret
)
if ($GroupTag) { $Args += @('-GroupTag', $GroupTag) }

Get-WindowsAutoPilotInfo @Args
