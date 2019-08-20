using Flurl;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CbtScreenshotTask {
  class CbtClient {
    readonly static string CbtAPIBaseUri = "https://crossbrowsertesting.com/api/v3/screenshots";
    private AppProject project;
    private AppPage page;
    private HttpClient client;
    public string LastError { get; internal set; }

    public CbtClient(AppProject project, AppPage page) {
      this.project = project;
      this.page = page;

      this.client = new HttpClient();

      var bytes = Encoding.UTF8.GetBytes(project.AuthName + ":" + project.AuthKey);
      var token = Convert.ToBase64String(bytes);
      this.client.DefaultRequestHeaders.Add("Authorization", "Basic " + token);
    }

    public async Task<CbtScreenshot> TakeScreenshot(AppTask task) {
      var resultId = task.Type == AppTaskType.Desktop ? page.DesktopResultId : page.MobileResultId;
      var browsers = task.Type == AppTaskType.Desktop ? project.DesktopBrowsers : project.MobileBrowsers;

      string apiUri;
      if (string.IsNullOrWhiteSpace(resultId)) {
        // new one
        apiUri = CbtAPIBaseUri;
      } else {
        // update one
        var info = await GetScreenshotInfo(resultId);
        var version = info.versions.First();

        apiUri = Url.Combine(CbtAPIBaseUri, resultId, version.version_id.ToString());
      }

      var targetUrl = "https://" + Url.Combine(project.Domain, page.Path);
      var body = JsonConvert.SerializeObject(new {
        format = "json",
        url = targetUrl,
        browsers = browsers
      });

      var content = new StringContent(body);
      content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");

      var tryCount = 0;
      LastError = null;
      Logger.Log($"Start taking {task.Type} screenshot of {targetUrl}");

    START:
      HttpResponseMessage res = await client.PostAsync(apiUri, content);

      if (tryCount > 3) {
        Logger.Log($"Stop {task.Type} screenshot of {targetUrl} by retry 3 times");

        return null;
      }

      if (res.StatusCode != HttpStatusCode.OK) {
        LastError = await res.Content.ReadAsStringAsync();
        Logger.Log($"{task.Type} screenshot of {targetUrl} failed, Error: {LastError}");

        Thread.Sleep(10_000);
        tryCount++;
        goto START;
      }

      var json = await res.Content.ReadAsStringAsync();
      var result = JsonConvert.DeserializeObject<CbtScreenshot>(json);

      return result;
    }

    public async Task WaitForScreenshotDone(CbtScreenshot result) {
    START:
      CbtScreenshot info = await GetScreenshotInfo(result.screenshot_test_id.ToString());

      if (info.versions.First().active) {
        Logger.Log($"{result.url} is still running.");

        Thread.Sleep(90_000);
        goto START;
      }
    }

    public async Task<CbtScreenshot> GetScreenshotInfo(string resultId) {
      var json = await client.GetStringAsync(Url.Combine(CbtAPIBaseUri, resultId));

      return JsonConvert.DeserializeObject<CbtScreenshot>(json);
    }
  }
}
