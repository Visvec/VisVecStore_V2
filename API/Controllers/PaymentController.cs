using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public PaymentController(IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _httpClient = httpClientFactory.CreateClient();
        _config = config;
    }

    [HttpPost("mobile-money")]
    public async Task<IActionResult> MobileMoneyPayment([FromBody] MobileMoneyRequest request)
    {
        var paystackSecret = _config["Paystack:SecretKey"];
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", paystackSecret);

        var payload = new
        {
            amount = request.Amount,
            email = request.Email,
            currency = "GHS",
            mobile_money = new
            {
                phone = request.Phone,
                provider = request.Provider
            },
            metadata = new
            {
                shipping_address = new
                {
                    hostel = request.ShippingAddress.Hostel,
                    landmark = request.ShippingAddress.Landmark,
                    city = request.ShippingAddress.City,
                    contact = request.ShippingAddress.Contact,
                    region = request.ShippingAddress.Region
                }
            }
        };

        var json = JsonSerializer.Serialize(payload);
        var response = await _httpClient.PostAsync("https://api.paystack.co/charge",
            new StringContent(json, Encoding.UTF8, "application/json"));

        var responseContent = await response.Content.ReadAsStringAsync();
        return Content(responseContent, "application/json");
    }
[HttpGet("test-config")]
public IActionResult TestConfig()
{
    var secret = _config.GetValue<string>("Paystack:SecretKey");
    return Ok(new { SecretKey = secret ?? "NULL" });
}

}

public class MobileMoneyRequest
{
    public required string Email { get; set; }
    public required string Phone { get; set; }
    public required string Provider { get; set; }
    public int Amount { get; set; } // in pesewas
    public required ShippingAddress ShippingAddress { get; set; }
}

public class ShippingAddress
{
    public required string Hostel { get; set; }
    public string? Landmark { get; set; }
    public required string City { get; set; }
    public required string Contact { get; set; }
    public required string Region { get; set; }
}

public class RefundRequest
{
    public required string Reference { get; set; }
}
