using jibz.api.Enums;
using jibz.api.Models;

namespace jibz.api.Models;

public class ClipUser
{
    public int Id { get; set; }

    public int ClipId { get; set; }
    public Clip Clip { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public ClipUserRole Role { get; set; }
    public ClipUserStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }
}