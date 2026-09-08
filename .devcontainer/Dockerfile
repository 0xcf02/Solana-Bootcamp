# Lightweight Node.js 20 base image (much faster to build/pull than the full Rust image).
# Rust and the Solana CLI are installed on top so students never touch a local install.
FROM mcr.microsoft.com/devcontainers/javascript-node:1-20

USER root

# Standard build tools required by native Node modules and the Solana toolchain
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        pkg-config \
        libssl-dev \
        libudev-dev \
        curl \
        git \
    && rm -rf /var/lib/apt/lists/*

# --- Rust (kept minimal, no docs/rustc-src) ---
ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | \
        sh -s -- -y --profile minimal --default-toolchain stable \
    && chmod -R a+w "$RUSTUP_HOME" "$CARGO_HOME"

# --- Solana CLI (devnet-ready, no manual install for students) ---
RUN sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)" \
    && ln -s /root/.local/share/solana/install/active_release/bin/* /usr/local/bin/ \
    && chmod -R a+rx /root/.local/share/solana

ENV PATH="/usr/local/bin:${PATH}"

USER node
