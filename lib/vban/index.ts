import { createSocket, Socket } from "dgram";

export class VBANClient {
  ip: string;
  port: number;
  #client: Socket;
  #index: number;

  constructor(ip: string, port: number) {
    this.ip = ip;
    this.port = port;
    this.#index = 1;
    this.#client = createSocket("udp4");
  }

  async text(stream: string, message: string) {
    await this.#send(
      this.#makePacket(stream, Buffer.from(message, "utf-8") as any)
    );
  }

  #makePacket(stream: string, content: Uint8Array): Uint8Array {
    return new Uint8Array([
      ...encodeFixedString("VBAN", 4),
      0b01000000,
      0,
      0,
      0x10,
      ...encodeFixedString(stream, 16),
      ...encodeInt(this.#index++),
      ...content,
    ]);
  }

  async #send(msg: Uint8Array) {
    await new Promise<number>((ful, rej) => {
      this.#client.send(msg, this.port, this.ip, (err, bytes) =>
        err ? rej(err) : ful(bytes)
      );
    });
  }
}

function encodeFixedString(str: string, length?: number) {
  length ??= str.length;
  return Uint8Array.from({ length }, (_, index) =>
    str.length <= index ? 0 : str.charCodeAt(index)
  );
}

function encodeInt(int: number): Uint8Array {
  const out = new Uint8Array(4);
  new DataView(out.buffer).setInt32(0, int, true);
  return out;
}
