using System;

namespace API.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public required string BuyerEmail { get; set; }
        public DateTime OrderDate { get; set; }
        // Add other properties, e.g., OrderItems, ShippingAddress, etc.
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        // e.g. ShippingAddress property if you use it:
        public required ShippingAddress ShippingAddress { get; set; }
        public decimal Subtotal { get; set; }
        public decimal DeliveryFee { get; set; }
        public required string PaymentIntentId { get; set; }
        public string? Reference { get; set; }
     public string? Status { get; set; }
    }
}
