using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;                // Assuming your DbContext namespace
using API.DTOs;                // Assuming your DTOs namespace
using API.Entities;            // Assuming your entities namespace

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly StoreContext _context;

        public OrdersController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetailsDto>> GetOrderById(int id)
        {
            var userName = User.Identity?.Name;
            if (userName == null) return Unauthorized();
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == id && o.BuyerEmail == userName);

            if (order == null) return NotFound();

            var dto = new OrderDetailsDto
            {
                Id = order.Id,
                BuyerEmail = order.BuyerEmail,
                OrderDate = order.OrderDate,
                City = order.ShippingAddress.City,
                Region = order.ShippingAddress.Region,
                Subtotal = order.Subtotal,
                DeliveryFee = order.DeliveryFee,
                PaymentIntentId = order.PaymentIntentId,
                Items = order.OrderItems.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    Name = i.Product.Name,
                    PictureUrl = i.Product.PictureUrl,
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList()
            };

            return Ok(dto);
        }
    }
}
