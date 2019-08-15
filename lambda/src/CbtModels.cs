
using System.Collections.Generic;

namespace CbtScreenshotTask
{
  public class CbtScreenshotVersion
  {
    public int version_id { get; set; }
    public bool active { get; set; }
  }

  public class CbtScreenshot
  {
    public int screenshot_test_id { get; set; }
    public string url { get; set; }
    public int version_count { get; set; }
    public List<CbtScreenshotVersion> versions { get; set; }
  }
}
