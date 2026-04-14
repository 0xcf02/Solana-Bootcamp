# Use a base image with Rust pre-installed
FROM mcr.microsoft.com/devcontainers/rust:1

# Install Solana CLI
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"

# Install Anchor Version Manager (avm)
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force && \
    /usr/local/cargo/bin/avm install latest && \
    /usr/local/cargo/bin/avm use latest

# Set environment variables for Solana and Anchor
ENV PATH="/home/vscode/.local/share/solana/install/active_release/bin:/home/vscode/.cargo/bin:${PATH}"