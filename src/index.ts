import axios from "axios";
import { SETTINGS } from "./config";
import Period from "./enums/Period";
import Candle from "./models/Candle";
import { createMessageChannel } from "./messages/messageChannel";

/**
 * Responsável por buscar o preço do Bitcoin em uma API pública.
 */
export async function fetchMarketPrice(): Promise<number> {
  try {
    const { data } = await axios.get(SETTINGS.pricesApi);
    const price = data.bitcoin.usd;
    console.log(`Current Bitcoin price: $${price.toFixed(2)}`);
    return price;
  } catch (error) {
    console.error("Error fetching market price:", error);
    throw error;
  }
}

/**
 * Responsável por construir o Candle, reunindo valores em intervalos específicos.
 */
export async function buildCandleData(): Promise<Candle> {
  // Quantas vezes vamos coletar o preço dentro de 5 minutos,
  // considerando intervalos de 10 segundos
  const loopTimes = Period.FIVE_MINUTES / Period.TEN_SECONDS;
  const candle = new Candle("BTC", new Date());

  console.log("-----------------------");
  console.log(`Generating candles for ${Period.FIVE_MINUTES} seconds`);

  for (let i = 0; i < loopTimes; i++) {
    const price = await fetchMarketPrice();
    candle.addValue(price);
    console.log(`Market Price #${i + 1} of ${loopTimes}`);

    // Period.TEN_SECONDS = 10, mas setTimeout() trabalha em ms, então multiplique por 1000
    await new Promise((resolve) =>
      setTimeout(resolve, Period.TEN_SECONDS * 1000)
    );
  }

  candle.closeCandle();
  console.log("Candle closed");
  return candle;
}

/**
 * Responsável por enviar o Candle convertido para JSON ao RabbitMQ.
 */
export async function sendCandleToQueue(candle: Candle) {
  const messageChannel = await createMessageChannel();
  if (!messageChannel) {
    throw new Error("Could not create message channel");
  }
  const candleJson = JSON.stringify(candle.toSimpleObject());
  messageChannel.sendToQueue(SETTINGS.queueName, Buffer.from(candleJson));
  console.log("Candle sent to RabbitMQ");
}

/**
 * Função principal que orquestra o processo de geração contínua de candles.
 */
export async function startCandleGeneration() {
  while (true) {
    try {
      const candle = await buildCandleData();
      await sendCandleToQueue(candle);
    } catch (error) {
      console.error("Error generating or sending candle:", error);
      // Se ocorrer erro, aguarde 5 segundos antes de tentar novamente
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

// Inicia o processo
startCandleGeneration();
