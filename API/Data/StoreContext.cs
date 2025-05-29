using System;
using System.Reflection.Emit;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public required DbSet<Cart> Carts { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<Order>().OwnsOne(o => o.ShippingAddress);
        builder.Entity<Order>()
        .Property(o => o.Subtotal)
        .HasPrecision(18, 2);

        builder.Entity<Order>()
            .Property(o => o.DeliveryFee)
            .HasPrecision(18, 2);

        builder.Entity<OrderItem>()
            .Property(oi => oi.Price)
            .HasPrecision(18, 2);

        builder.Entity<IdentityRole>()
                .HasData(
                    new IdentityRole { Id = "6e891dfd-9006-4fda-9e8d-e59342154e0a", Name = "Member", NormalizedName = "MEMBER" },
                    new IdentityRole { Id = "d5aa180e-3bd8-4745-a5da-085ee5f9dbeb", Name = "Admin", NormalizedName = "ADMIN" }
                );
    }

}
