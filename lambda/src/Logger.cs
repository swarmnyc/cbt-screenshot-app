using Amazon.Lambda.Core;

namespace CbtScreenshotTask {
  class Logger {
    private static ILambdaLogger instance;

    public static string TaskId { get; set; }
    public static ILambdaLogger Instance {
      get => instance;
      set { instance = value; TaskId = null; }
    }

    public static void Log(string message) {
      if (TaskId == null) {
        Instance.LogLine(message);
      } else {
        Instance.LogLine($"${TaskId}> {message}");
      }
    }
  }
}