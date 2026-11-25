using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace SanadPlatform.API.Infrastructure.Security;

/// <summary>
/// Service for encrypting and decrypting sensitive data using AES-256-GCM.
/// Provides authenticated encryption for PII and health records.
/// </summary>
public interface IEncryptionService
{
    /// <summary>
    /// Encrypts plain text using AES-256-GCM algorithm.
    /// </summary>
    /// <param name="plainText">The text to encrypt</param>
    /// <returns>Base64-encoded encrypted data with IV and tag appended</returns>
    string Encrypt(string plainText);

    /// <summary>
    /// Decrypts cipher text encrypted with AES-256-GCM algorithm.
    /// Verifies authentication tag to ensure data integrity.
    /// </summary>
    /// <param name="cipherText">The base64-encoded encrypted data</param>
    /// <returns>The decrypted plain text</returns>
    string Decrypt(string cipherText);
}

/// <summary>
/// Implementation of AES-256-GCM encryption service.
/// Uses authenticated encryption (AEAD) to ensure both confidentiality and integrity.
/// </summary>
public class EncryptionService : IEncryptionService
{
    private readonly byte[] _key;
    private const int KeySize = 32; // 256 bits for AES-256
    private const int TagSize = 16; // 128 bits for GCM tag
    private const int IVSize = 12; // 96 bits for GCM IV (nonce)

    /// <summary>
    /// Initializes the encryption service with a key from configuration.
    /// </summary>
    /// <param name="key">Base64-encoded encryption key (32 bytes for AES-256)</param>
    /// <exception cref="ArgumentException">Thrown if key is invalid length</exception>
    public EncryptionService(string key)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            throw new ArgumentException("Encryption key cannot be null or empty", nameof(key));
        }

        _key = Convert.FromBase64String(key);

        if (_key.Length != KeySize)
        {
            throw new ArgumentException($"Encryption key must be {KeySize} bytes, got {_key.Length}", nameof(key));
        }
    }

    /// <summary>
    /// Encrypts plain text using AES-256-GCM with random IV.
    /// Returns IV + ciphertext + tag encoded as base64.
    /// </summary>
    public string Encrypt(string plainText)
    {
        if (string.IsNullOrEmpty(plainText))
        {
            throw new ArgumentException("Plain text cannot be null or empty", nameof(plainText));
        }

        using (var cipher = new AesGcm(_key, TagSize))
        {
            // Generate random IV (nonce)
            var iv = new byte[IVSize];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(iv);
            }

            // Prepare buffers
            var plainBytes = Encoding.UTF8.GetBytes(plainText);
            var cipherBytes = new byte[plainBytes.Length];
            var tag = new byte[TagSize];

            // Encrypt and authenticate
            cipher.Encrypt(iv, plainBytes, cipherBytes, tag);

            // Combine IV + ciphertext + tag
            var result = new byte[IVSize + cipherBytes.Length + TagSize];
            Buffer.BlockCopy(iv, 0, result, 0, IVSize);
            Buffer.BlockCopy(cipherBytes, 0, result, IVSize, cipherBytes.Length);
            Buffer.BlockCopy(tag, 0, result, IVSize + cipherBytes.Length, TagSize);

            // Return as base64 string
            return Convert.ToBase64String(result);
        }
    }

    /// <summary>
    /// Decrypts cipher text encrypted with AES-256-GCM.
    /// Verifies authentication tag for integrity.
    /// </summary>
    public string Decrypt(string cipherText)
    {
        if (string.IsNullOrWhiteSpace(cipherText))
        {
            throw new ArgumentException("Cipher text cannot be null or empty", nameof(cipherText));
        }

        try
        {
            // Decode from base64
            var encryptedData = Convert.FromBase64String(cipherText);

            // Verify minimum length (IV + tag)
            if (encryptedData.Length < IVSize + TagSize)
            {
                throw new ArgumentException("Invalid cipher text format", nameof(cipherText));
            }

            // Extract IV, ciphertext, and tag
            var iv = new byte[IVSize];
            var tag = new byte[TagSize];
            var cipher = new byte[encryptedData.Length - IVSize - TagSize];

            Buffer.BlockCopy(encryptedData, 0, iv, 0, IVSize);
            Buffer.BlockCopy(encryptedData, IVSize, cipher, 0, cipher.Length);
            Buffer.BlockCopy(encryptedData, IVSize + cipher.Length, tag, 0, TagSize);

            using (var aesGcm = new AesGcm(_key, TagSize))
            {
                // Decrypt and verify authentication tag
                var plainBytes = new byte[cipher.Length];
                aesGcm.Decrypt(iv, cipher, tag, plainBytes);
                return Encoding.UTF8.GetString(plainBytes);
            }
        }
        catch (CryptographicException ex)
        {
            throw new InvalidOperationException("Decryption failed - authentication tag verification failed", ex);
        }
        catch (FormatException ex)
        {
            throw new ArgumentException("Invalid cipher text format - not valid base64", nameof(cipherText), ex);
        }
    }

    /// <summary>
    /// Generates a random encryption key suitable for AES-256.
    /// Used for configuration initialization.
    /// </summary>
    public static string GenerateKey()
    {
        var key = new byte[KeySize];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(key);
        }
        return Convert.ToBase64String(key);
    }
}
