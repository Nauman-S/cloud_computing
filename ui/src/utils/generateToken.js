// FUNCTIONS TO HANDLE CONVERSION OF CSRF TOKEN - START
function base64URLencode(bytes) {
  const base64Encoded = btoa(String.fromCharCode(...bytes));
  return base64Encoded
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function xorBytes(a, b) {
  if (a.length !== b.length) {
    throw new Error("Byte arrays must be of equal length");
  }
  const result = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

export default function generateToken(token) {
  const tokenBytes = new TextEncoder().encode(token);

  const randomBytes = crypto.getRandomValues(new Uint8Array(tokenBytes.length));

  const xoredBytes = xorBytes(randomBytes, tokenBytes);

  const combinedBytes = new Uint8Array(randomBytes.length + xoredBytes.length);
  combinedBytes.set(randomBytes, 0);
  combinedBytes.set(xoredBytes, randomBytes.length);

  return base64URLencode(combinedBytes);
}
// FUNCTIONS TO HANDLE CONVERSION OF CSRF TOKEN - END
