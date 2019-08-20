using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CbtScreenshotTask
{
  enum AppTaskState
  {
    Pending,
    Executing,
    Executed,
    Canceled,
    Error
  }

  enum AppTaskType
  {
    Desktop,
    Mobile
  }

  [BsonIgnoreExtraElements()]
  class AppTask
  {
    [BsonId]
    public ObjectId Id { get; set; }

    [BsonElement("projectId")]
    public ObjectId ProjectId { get; set; }

    [BsonElement("pageId")]
    public ObjectId PageId { get; set; }

    [BsonElement("type"), BsonRepresentation(BsonType.String)]
    public AppTaskType Type { get; set; }

    [BsonElement("state"), BsonRepresentation(BsonType.String)]
    public AppTaskState State { get; set; }

    [BsonElement("reason")]
    public string Reason { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; }

    [BsonElement("executedAt")]
    public DateTime? ExecutedAt { get; set; }

    [BsonElement("finishedAt")]
    public DateTime? FinishedAt { get; set; }
  }

  [BsonIgnoreExtraElements()]
  class AppProject
  {
    [BsonId]
    public ObjectId Id { get; set; }

    [BsonElement("domain")]
    public string Domain { get; set; }

    [BsonElement("authName")]
    public string AuthName { get; set; }

    [BsonElement("authKey")]
    public string AuthKey { get; set; }

    [BsonElement("desktopBrowsers")]
    public string[] DesktopBrowsers { get; set; }

    [BsonElement("mobileBrowsers")]
    public string[] MobileBrowsers { get; set; }

    [BsonElement("awsKey")]
    public string AwsKey { get; internal set; }

    [BsonElement("awsKeySecret")]
    public string AwsKeySecret { get; internal set; }

    [BsonElement("awsRegion")]
    public string AwsRegion { get; internal set; }

    [BsonElement("awsSqsUrl")]
    public string AwsSqsUrl { get; internal set; }
  }

  [BsonIgnoreExtraElements()]
  class AppPage
  {
    [BsonId]
    public ObjectId Id { get; set; }

    [BsonElement("projectId")]
    public ObjectId ProjectId { get; set; }

    [BsonElement("path")]
    public string Path { get; set; }

    [BsonElement("desktopResultId")]
    public string DesktopResultId { get; set; }

    [BsonElement("mobileResultId")]
    public string MobileResultId { get; set; }
  }
}
