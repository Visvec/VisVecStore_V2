using System;

namespace API.Entities;

 public class OrderItem
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public required Product Product { get; set; }  // Make sure you have Product class defined too

        public int Quantity { get; set; }
        public decimal Price { get; set; }

        public int OrderId { get; set; }
        public required Order Order { get; set; }
    }
