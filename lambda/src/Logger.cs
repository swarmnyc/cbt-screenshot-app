using Amazon.Lambda.Core;

namespace CbtScreenshotTask {
  class Logger {
    public static ILambdaLogger Instance { get; set; }

    public static void Log(string message) {
      Instance.LogLine(message);
    }
  }
}