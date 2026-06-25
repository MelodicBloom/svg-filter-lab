#!/usr/bin/env bash
# =============================================================
#  deploy.sh — svg-filter-lab one-command deploy
#  Usage:
#    ./deploy.sh                        # auto commit + push
#    ./deploy.sh "your commit message"  # custom message
#    ./deploy.sh --dry-run              # preview only
# =============================================================
set -euo pipefail

# ---- Config -------------------------------------------------
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BRANCH="main"
DEFAULT_MSG="chore: update svg-filter-lab [$(date '+%Y-%m-%d %H:%M')]"
DRY_RUN=false

# ---- Colors -------------------------------------------------
GREEN=$'\033[0;32m'
CYAN=$'\033[0;36m'
YELLOW=$'\033[0;33m'
RED=$'\033[0;31m'
DIM=$'\033[2m'
NC=$'\033[0m'

log()  { echo -e "${CYAN}[deploy]${NC} $*"; }
ok()   { echo -e "${GREEN}[✔]${NC} $*"; }
warn() { echo -e "${YELLOW}[warn]${NC} $*"; }
die()  { echo -e "${RED}[error]${NC} $*" >&2; exit 1; }

# ---- Parse args ---------------------------------------------
COMMIT_MSG="$DEFAULT_MSG"
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    *)         COMMIT_MSG="$arg" ;;
  esac
done

# ---- Checks -------------------------------------------------
cd "$REPO_DIR"

[[ -d .git ]] || die "Not a git repository: $REPO_DIR"
command -v git &>/dev/null || die "git is not installed"

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" != "$BRANCH" ]]; then
  warn "On branch '$CURRENT_BRANCH', expected '$BRANCH'."
  read -rp "Continue anyway? [y/N] " confirm
  [[ "$confirm" =~ ^[Yy]$ ]] || { log "Aborted."; exit 0; }
fi

# ---- Status -------------------------------------------------
log "Repo:    $REPO_DIR"
log "Branch:  $CURRENT_BRANCH"
log "Message: $COMMIT_MSG"
$DRY_RUN && warn "DRY RUN — no changes will be pushed"
echo ""

# ---- Diff preview -------------------------------------------
CHANGED=$(git status --porcelain)
if [[ -z "$CHANGED" ]]; then
  ok "Nothing to commit — working tree is clean."
  exit 0
fi

echo -e "${DIM}Changed files:${NC}"
git status --short
echo ""

# ---- Stage + commit + push ----------------------------------
if $DRY_RUN; then
  ok "Dry run complete. Would commit: '$COMMIT_MSG'"
  exit 0
fi

git add -A
git commit -m "$COMMIT_MSG"

log "Pushing to origin/$BRANCH..."
git push origin "$BRANCH"

echo ""
ok "Deployed! Commit: $(git rev-parse --short HEAD)"
ok "Live at: https://$(git remote get-url origin | sed 's/.*github.com[:/]//;s/\.git$//' | tr '/' '.').github.io/$(basename "$REPO_DIR")"
