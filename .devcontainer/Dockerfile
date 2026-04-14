FROM mcr.microsoft.com/devcontainers/rust:1

# 1. Instalamos a Solana CLI como usuário vscode para ficar na home certa
# Usamos o --retry para ignorar oscilações de rede como a do log
USER vscode
RUN curl -sSfL --retry 5 https://release.solana.com/v1.18.4/install | sh

# 2. Voltamos para root para instalar o AVM globalmente
USER root
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# 3. Instalamos o Anchor usando o caminho correto que o log confirmou
RUN /usr/local/cargo/bin/avm install latest && /usr/local/cargo/bin/avm use latest

# 4. Configuramos o PATH definitivo para que o terminal reconheça os comandos
ENV PATH="/home/vscode/.local/share/solana/install/active_release/bin:/usr/local/cargo/bin:${PATH}"