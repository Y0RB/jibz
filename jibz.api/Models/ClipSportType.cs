namespace jibz.api.Models;
using jibz.api.Enums;
public class ClipSportType
{
    public int ClipId { get; set; }
    public Clip Clip { get; set; } = null!;

    public SportType Sport { get; set; }
}