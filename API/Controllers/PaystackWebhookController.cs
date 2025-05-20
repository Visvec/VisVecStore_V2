#nullable enable

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Data;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaystackWebhookController : ControllerBase
    {
        private readonly ILogger<PaystackWebhookController> _logger;
        private readonly IConfiguration _config;
        private readonly StoreContext _context;

        public PaystackWebhookController(
            ILogger<PaystackWebhookController> logger,
            IConfiguration config,
            StoreContext context)
        {
            _logger = logger;
            _config = config;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            var secretKey = _config["Paystack:SecretKey"];

            if (string.IsNullOrEmpty(secretKey))
            {
                _logger.LogError("Paystack secret key is missing from configuration.");
                return StatusCode(500, "Paystack secret key not configured.");
            }

            var signatureHeader = Request.Headers["x-paystack-signature"].ToString();

            using var reader = new StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();

            var computedHash = ComputeHmacSha512(secretKey, body);

            if (computedHash != signatureHeader)
            {
                _logger.LogWarning("Invalid Paystack signature.");
                return Unauthorized();
            }

            JsonDocument jsonDoc;
            try
            {
                jsonDoc = JsonDocument.Parse(body);
            }
            catch (JsonException ex)
            {
                _logger.LogError($"Failed to parse Paystack webhook body: {ex.Message}");
                return BadRequest("Invalid JSON format.");
            }

            var payload = jsonDoc.RootElement;

            if (!payload.TryGetProperty("event", out var eventProperty) ||
                !payload.TryGetProperty("data", out var dataProperty) ||
                !dataProperty.TryGetProperty("reference", out var referenceProperty))
            {
                _logger.LogWarning("Missing expected properties in webhook payload.");
                return BadRequest("Missing data.");
            }

            var eventType = eventProperty.GetString();
            var reference = referenceProperty.GetString();

            if (eventType == "charge.success" && !string.IsNullOrEmpty(reference))
            {
                _logger.LogInformation($"Payment successful for reference: {reference}");

                var order = await _context.Orders.FirstOrDefaultAsync(o => o.Reference == reference);

                if (order != null)
                {
                    order.Status = "Paid"; // Replace with order.IsPaid = true or set PaymentDate = DateTime.UtcNow if needed
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Order {reference} marked as paid.");
                }
                else
                {
                    _logger.LogWarning($"No order found with reference: {reference}");
                }
            }

            return Ok();
        }

        private static string ComputeHmacSha512(string secret, string payload)
        {
            var keyBytes = Encoding.UTF8.GetBytes(secret);
            var payloadBytes = Encoding.UTF8.GetBytes(payload);

            using var hmac = new HMACSHA512(keyBytes);
            var hashBytes = hmac.ComputeHash(payloadBytes);

            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }
    }
}
