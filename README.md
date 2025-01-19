# Sistema de Leitura do Valor do Bitcoin

Este repositório contém um projeto que realiza leituras do valor do Bitcoin em tempo real, utilizando **Node.js**, **TypeScript**, **RabbitMQ**, **Axios** e **Vue.js** (no front-end). O objetivo é disponibilizar uma forma simples de acompanhar o valor da criptomoeda e tratar esse fluxo de dados em um ambiente construído com tecnologias modernas.

## Visão Geral

O projeto consiste em um sistema que faz a coleta de dados do valor do Bitcoin em uma API externa (através do **Axios**) e envia esses dados para uma fila gerenciada pelo **RabbitMQ**. Em seguida, o front-end (desenvolvido em **Vue.js**) consome as informações e exibe o valor do Bitcoin em tempo real para o usuário.

## Tecnologias Utilizadas

- **Node.js** (com **TypeScript**) para o back-end
- **RabbitMQ** para mensageria e comunicação entre serviços
- **Axios** para fazer requisições HTTP à API de cotação
- **Vue.js** para o front-end
- **Docker** (para subir facilmente o serviço do RabbitMQ)
- **Yarn** para gerenciamento de dependências

## Arquitetura do Projeto

1. **Serviço de captura de valor do Bitcoin** (Node.js/TypeScript):

   - Consome uma API pública para obter o valor do Bitcoin.
   - Publica as informações em uma fila do RabbitMQ.

2. **Serviço de escuta/consumo** (Node.js/TypeScript):

   - Fica escutando a fila do RabbitMQ.
   - Processa e/ou salva os dados para serem disponibilizados ao front-end.

3. **Front-end (Vue.js)**:
   - Recebe as atualizações do valor do Bitcoin (via requisições periódicas ou outra abordagem configurada).
   - Renderiza as informações em tempo real para o usuário.

## Requisitos

- **Node.js** (versão 14 ou superior)
- **Yarn**
- **Docker** e **Docker Compose**
- **Git**

## Instalação e Execução

1. **Clonar o repositório**

   ```bash
   git clone https://github.com/marciodeveloper/bitcoin-candle-genertor
   cd bitcoin-candle-generator
   ```

2. **Subir o Container do RabbitMQ**

   ```bash
   docker-compose up -d
   ```

3. **Instalar dependência**

   ```bash
   cd bitcoin-candle-generator
   yarn install
   ```

4. **Iniciar o Servidor**

   ```bash
   yarn start
   ```
