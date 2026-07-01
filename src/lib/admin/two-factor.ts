import "server-only";
import { authenticator } from "otplib";
import QRCode from "qrcode";

export function generateTwoFactorSecret() {
  return authenticator.generateSecret();
}

export function verifyTwoFactorToken(secret: string, token: string) {
  try {
    return authenticator.verify({ token, secret });
  } catch {
    return false;
  }
}

export async function generateTwoFactorQrCode(email: string, secret: string) {
  const otpauth = authenticator.keyuri(email, "Laurie Coiffure Admin", secret);
  return QRCode.toDataURL(otpauth);
}
