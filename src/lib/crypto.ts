import CryptoJS from 'crypto-js'

export class EncryptionService {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.key).toString()
  }

  decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.key)
    return bytes.toString(CryptoJS.enc.Utf8)
  }

  generateKey(): string {
    return CryptoJS.lib.WordArray.random(32).toString()
  }

  hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString()
  }
}

export const generateRoomKey = (): string => {
  return CryptoJS.lib.WordArray.random(32).toString()
} 