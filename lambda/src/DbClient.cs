using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;

namespace CbtScreenshotTask {
  class DbClient {
    string DbConnectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");

    string DbName = Environment.GetEnvironmentVariable("DB_NAME");

    MongoClient client;

    IMongoDatabase db;

    IMongoCollection<AppTask> taskCollection;
    IMongoCollection<AppProject> projectCollection;
    IMongoCollection<AppPage> pageCollection;

    public DbClient() {
      client = new MongoClient(DbConnectionString);
      db = client.GetDatabase(DbName);
      taskCollection = db.GetCollection<AppTask>("tasks");
      projectCollection = db.GetCollection<AppProject>("projects");
      pageCollection = db.GetCollection<AppPage>("pages");
    }

    public Task<AppProject> GetProject(ObjectId projectId) {
      return projectCollection.Find(d => d.Id == projectId).FirstOrDefaultAsync();
    }

    public Task<AppPage> GetPage(ObjectId pageId) {
      return pageCollection.Find(d => d.Id == pageId).FirstOrDefaultAsync();
    }

    public async Task<bool> CheckHasExecutingTasks() {
      var result = await taskCollection
      .Find(d => d.State == AppTaskState.Executing)
      .SortBy(d => d.ExecutedAt).ToListAsync();

      if (result.Count > 0) {
        // check if tasks if or not have problem
        var problemList = new List<AppTask>();

        result.ForEach((t) => {
          var diff = DateTime.UtcNow - result[0].ExecutedAt.Value;

          if (diff.Minutes > 15) {
            // if more than 15 min, then the task might have problem, so remove it.
            result.Remove(t);
            problemList.Add(t);
          }
        });

        if (problemList.Count > 0) {
          var tasks = problemList.Select((t) => {
            var filter = Builders<AppTask>.Filter.Eq(d => d.Id, t.Id);
            var update = Builders<AppTask>.Update.Set(d => d.State, AppTaskState.Error)
              .Set(d => d.FinishedAt, DateTime.UtcNow);

            return taskCollection.UpdateOneAsync(filter, update);
          });

          Task.WaitAll(tasks.ToArray());
        }

        return result.Count != 0;
      } else {
        return false;
      }
    }

    public async Task<bool> HasPendingTask() {
      var result = await taskCollection.CountDocumentsAsync(d => d.State == AppTaskState.Pending);

      return result != 0;
    }

    public async Task<AppTask> GetNextPendingTask() {
      var result = await taskCollection
      .Find(d => d.State == AppTaskState.Pending)
      .SortBy(d => d.CreatedAt)
      .Limit(1)
      .ToListAsync();

      var task = result.FirstOrDefault();

      if (task != null) {
        var filter = Builders<AppTask>.Filter.Eq(d => d.Id, task.Id);
        var update = Builders<AppTask>.Update.Set(d => d.State, AppTaskState.Executing)
          .Set(d => d.ExecutedAt, DateTime.UtcNow);

        await taskCollection.UpdateOneAsync(filter, update);
      }

      return task;
    }

    public async Task UpdatePageAndTaskResult(AppPage page, AppTask task, CbtScreenshot result) {
      // update page
      UpdateDefinition<AppPage> pageUpdate = null;
      var resultId = result.screenshot_test_id.ToString();
      if (task.Type == AppTaskType.Desktop) {
        if (page.DesktopResultId != resultId) {
          pageUpdate = Builders<AppPage>.Update.Set(d => d.DesktopResultId, resultId);
        }
      } else {
        if (page.MobileResultId != resultId) {
          pageUpdate = Builders<AppPage>.Update.Set(d => d.MobileResultId, resultId);
        }
      }

      if (pageUpdate != null) {
        var pageFilter = Builders<AppPage>.Filter.Eq(d => d.Id, page.Id);

        await pageCollection.UpdateOneAsync(pageFilter, pageUpdate);
      }

      // update task
      var filter = Builders<AppTask>.Filter.Eq(d => d.Id, task.Id);
      var update = Builders<AppTask>.Update.Set(d => d.State, AppTaskState.Executed)
        .Set(d => d.FinishedAt, DateTime.UtcNow);

      await taskCollection.UpdateOneAsync(filter, update);
    }

    public Task MakeTaskError(AppTask task) {
      var filter = Builders<AppTask>.Filter.Eq(d => d.Id, task.Id);
      var update = Builders<AppTask>.Update.Set(d => d.State, AppTaskState.Error)
        .Set(d => d.FinishedAt, DateTime.UtcNow);

      return taskCollection.UpdateOneAsync(filter, update);
    }
  }
}
