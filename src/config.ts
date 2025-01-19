import { config } from "dotenv";

// Carrega variáveis de ambiente do arquivo .env
config();

/**
 * Objeto central de configurações.
 * Centraliza as variáveis para facilitar manutenção e testes.
 */
export const SETTINGS = {
  // API pública para obter o preço do Bitcoin
  pricesApi:
    process.env.PRICES_API ??
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",

  // Nome da fila no RabbitMQ
  queueName: process.env.QUEUE_NAME ?? "candles_queue",

  // URL de conexão com o RabbitMQ
  rabbitmqUrl: process.env.RABBITMQ_URL ?? "amqp://localhost",
};
