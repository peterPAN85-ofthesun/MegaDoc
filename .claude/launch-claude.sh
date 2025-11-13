#!/bin/bash
# Script de lancement Claude Code depuis Obsidian
# Usage: ./launch-claude.sh "/path/to/vault" "commande"

VAULT_PATH="$1"
COMMAND="$2"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier que le vault existe
if [ ! -d "$VAULT_PATH" ]; then
    echo "❌ Erreur: Le vault n'existe pas: $VAULT_PATH"
    exit 1
fi

# Aller dans le vault
cd "$VAULT_PATH" || exit 1

echo -e "${BLUE}🤖 Lancement de Claude Code...${NC}"
echo -e "${GREEN}📂 Vault: $VAULT_PATH${NC}"
echo ""

# Si une commande est fournie, l'afficher
if [ -n "$COMMAND" ]; then
    echo -e "${BLUE}📋 Commande à exécuter:${NC}"
    echo "$COMMAND"
    echo ""
    echo "Copiez cette commande et collez-la dans Claude Code avec Ctrl-Shift-V"
    echo ""

    # Copier dans le presse-papiers si possible
    if command -v xclip &> /dev/null; then
        echo "$COMMAND" | xclip -selection clipboard
        echo "✅ Commande copiée dans le presse-papiers"
    elif command -v xsel &> /dev/null; then
        echo "$COMMAND" | xsel --clipboard
        echo "✅ Commande copiée dans le presse-papiers"
    fi
    echo ""
fi

# Lancer Claude Code
# Option 1: Essayer avec claude (si installé globalement)
if command -v claude &> /dev/null; then
    echo "🚀 Lancement de Claude CLI..."
    claude
# Option 2: Sinon, instructions pour l'utilisateur
else
    echo "ℹ️  Claude CLI n'est pas trouvé dans le PATH"
    echo ""
    echo "📝 Instructions:"
    echo "1. Lancez Claude Code manuellement dans ce répertoire"
    echo "2. Collez la commande ci-dessus"
    echo ""
    echo "Ou installez Claude CLI pour un lancement automatique."
    echo ""

    # Garder le terminal ouvert
    echo "Appuyez sur Entrée pour fermer..."
    read
fi
