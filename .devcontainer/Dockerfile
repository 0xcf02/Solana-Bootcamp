FROM mcr.microsoft.com/devcontainers/rust:1

# Instalamos tudo como ROOT para garantir que os arquivos existam para o sistema todo
USER root

# 1. Instala Solana CLI direto no /usr/local
RUN sh -c "$(curl -sSfL --retry 5 https://release.solana.com/v1.18.4/install)" && \
    ln -s /root/.local/share/solana/install/active_release/bin/* /usr/local/bin/

# 2. Instala o AVM (Anchor) e joga para o binário global
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force && \
    ln -s /usr/local/cargo/bin/avm /usr/local/bin/avm

# 3. Instala a versão mais recente do Anchor e cria o atalho global
RUN avm install latest && avm use latest && \
    ln -s /root/.avm/bin/anchor /usr/local/bin/anchor

# 4. Garante que o usuário 'vscode' tenha permissão de ler essas pastas
RUN chmod -R 755 /root

# Forçamos o PATH no ambiente do container
ENV PATH="/usr/local/bin:${PATH}"