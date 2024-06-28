public with sharing class RecordFileDownloaderController {
  @AuraEnabled
  public static List<Id> getFileIds(String recordId) {
    Set<Id> contentDocumentIds = new Set<Id>();
    List<Id> contentVersionIds = new List<Id>();
    for (ContentDocumentLink cdl : [
      SELECT ContentDocumentId, LinkedEntityId, ContentDocument.FileType
      FROM ContentDocumentLink
      WHERE LinkedEntityId = :recordId
      WITH USER_MODE
    ]) {
      contentDocumentIds.add(cdl.ContentDocumentId);
    }
    if (contentDocumentIds.size() > 0) {
      for (ContentVersion cdv : [
        SELECT Id
        FROM ContentVersion
        WHERE isLatest = TRUE AND ContentDocumentId IN :contentDocumentIds
        WITH USER_MODE
      ]) {
        contentVersionIds.add(cdv.Id);
      }
    }
    return contentVersionIds;
  }
}
