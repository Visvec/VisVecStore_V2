using System;
using System.Collections.Generic;

namespace API.DTOs
{
    public class OrderDetailsDto
    {
        public int Id { get; set; }
        public required string BuyerEmail { get; set; }
        public DateTime OrderDate { get; set; }

        public required string City { get; set; }
        public required string Region { get; set; }
        public decimal Subtotal { get; set; }
        public decimal DeliveryFee { get; set; }
        public decimal Total => Subtotal + DeliveryFee;
        public required string PaymentIntentId { get; set; }

        public required List<OrderItemDto> Items { get; set; }
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public required string Name { get; set; }
        public required string PictureUrl { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
