using Amazon.Lambda.Core;
using Amazon.SQS;
using System.Threading.Tasks;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace CbtScreenshotTask
{
  public class CbtTaskExecutor
  {
    public async Task Handler(dynamic input, ILambdaContext context)
    {
      try
      {
        Logger.Instance = context.Logger;

        var dbClient = new DbClient();
        if (await dbClient.CheckHasExecutingTasks())
        {
          // only one task as one time
          Logger.Log("There is a task still in progress.");

          return;
        }

        var task = await dbClient.GetNextPendingTask();
        if (task == null)
        {
          Logger.Log("There is a no pending task.");

          return;
        }

        var project = await dbClient.GetProject(task.ProjectId);
        var page = await dbClient.GetPage(task.PageId);

        var cbtClient = new CbtClient(project, page);

        var result = await cbtClient.TakeScreenshot(task);

        Logger.Log($"Screenshot ResultId: {result.screenshot_test_id}.");

        await cbtClient.WaitForScreenshotDone(result);

        await dbClient.UpdatePageAndTaskResult(page, task, result);

        Logger.Log($"Screenshot {result.screenshot_test_id} is done.");

        if (await dbClient.HasPendingTask())
        {
          // trigger next one
          var sqsClient = new AmazonSQSClient(project.AwsKey, project.AwsKeySecret);

          await sqsClient.SendMessageAsync(project.AwsSqsUrl, "trigger next one");

          Logger.Log($"Next One triggered.");
        }
      }
      catch (System.Exception ex)
      {
        Logger.Log("Error: " + ex.ToString());
      }
    }
  }
}
