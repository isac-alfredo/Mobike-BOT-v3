#!/bin/bash
clear
echo -e "\033[1;36m"
echo "  __  __  ____  ____ _____ _  _______ "
echo " |  \/  |/ __ \|  _ \_   _| |/ / ____|"
echo " | \  / | |  | | |_) || | | ' /|  _|  "
echo " | |\/| | |__| |  _ < | | | . \| |___ "
echo " |_|  |_|\____/|_| \_\___/|_|\_\_____|"
echo " "
echo "     🛡️ MOBIKE BOT - ONLINE 🇲🇿"
echo -e "\033[0m"

while : 
do
    node index.js
    sleep 5
done
# Verificar se a pasta node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️ node_modules não encontrado. Instalando dependências...${NC}"
    npm install
fi

# Loop para reiniciar o bot automaticamente
while : 
do
    echo -e "${GREEN}✅ Bot ligado com sucesso! Online agora...${NC}"
    
    # Inicia o bot
    node index.js
    
    # Se o bot parar, o script continua aqui
    echo -e "${RED}⚠️ O Bot parou inesperadamente!${NC}"
    echo -e "${YELLOW}🔄 Reiniciando em 5 segundos (Pressione CTRL+C para cancelar)...${NC}"
    
    sleep 5
    echo -e "${CYAN}--- Reiniciando agora ---${NC}"
done