import { LightningElement, api } from "lwc";
import getFileIds from "@salesforce/apex/RecordFileDownloaderController.getFileIds";
import { NavigationMixin } from "lightning/navigation";
export default class RecordFileDownloader extends NavigationMixin(
  LightningElement
) {
  @api recordId;
  fileIds = "";
  error = "";

  get isDisabled() {
    return this.fileIds === "";
  }

  get downloadUrl() {
    return "/sfc/servlet.shepherd/version/download/" + this.fileIds;
  }

  connectedCallback() {
    getFileIds({
      recordId: this.recordId
    })
      .then((result) => {
        let fileDataList = JSON.parse(JSON.stringify(result));
        let fileIdsString = "";
        if (fileDataList) {
          for (let i in fileDataList) {
            if (i) {
              fileIdsString += fileDataList[i] + "/";
            }
          }
        }
        if (fileIdsString.length > 0) {
          fileIdsString = fileIdsString.replace(/.$/, "?");
        }
        this.fileIds = fileIdsString;
        this.error = undefined;
      })
      .catch((error) => {
        console.log("error : " + JSON.stringify(error));
        this.error = error;
      });
  }

  downloadFiles() {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: this.downloadUrl
      }
    });
  }
}
