import { Component, OnInit, ViewChild } from "@angular/core";
import { CollectionservicesService } from "../shared/collectionservices.service";
import { Key, element } from "protractor";
import { map } from "rxjs/operators";
import { NgForOf } from "@angular/common";
import { NgForm } from "@angular/forms";
import { threadId } from "worker_threads";
import { ITS_JUST_ANGULAR } from "@angular/core/src/r3_symbols";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-collections",
  templateUrl: "./collections.component.html",
  styleUrls: ["./collections.component.css"]
})
export class CollectionsComponent implements OnInit {
  constructor(public collectionService: CollectionservicesService) {}

  dbjson;
  arrres: Array<string>;
  collectionnameforreuse;
  dbNameReuse;

  Datatypeofselectedoption;

  isExpanded = "false";
  idOfItemToExpand = "";
  keysOfExpanded;
  ValuesOfExpanded;
  ObjectExpanded;

  defaultmin = 0;
  defaultmax = 25;

  min = 0;
  max = 25;

  ngOnInit(): void {
    this.getListOfDb();
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedColumns: string[];
  dataSource;

  objectType = "Object";
  getListOfDb() {
    console.log("in component");
    this.collectionService.getdbList().subscribe(res => {
      this.collectionService.dataBaseNames = res;
    });
  }

  getCollection(dbName) {
    this.dbNameReuse = dbName;
    console.log("here collcetion" + dbName.name);
    this.collectionService.getCollectionData(dbName).subscribe(res => {
      console.log("Got response");
      // console.log(res);
      this.collectionService.collectionFlag = 1;
      this.collectionService.collectionNames = res;
      console.log(this.collectionService.collectionNames);
    });

    this.min = 0;
    this.max = 25;
  }

  DeleteDb(dbName) {
    if (confirm("Sure you want to delete  " + '"' + dbName.name + '"')) {
      this.collectionService.DeleteDb(dbName).subscribe(res => {
        console.log("backup");
      });
    }
  }

  BackupDatabase(dbName) {
    this.collectionService.BackupDatabase(dbName).subscribe(res => {
      console.log("backup");
    });
  }

  DeleteCollection(collectionName) {
    if (
      confirm("Sure you want to delete  " + '" ' + collectionName.name + ' "')
    ) {
      this.collectionService.DeleteCollection(collectionName).subscribe(res => {
        this.getCollection(this.dbNameReuse);
        // this.collectionService.collectionFlag = 0;
      });
    }
  }

  ExportCollection() {
    this.collectionService
      .ExportCollection(this.collectionnameforreuse)
      .subscribe(res => {
        console.log("Exported collection");
      });
  }


  file:any;
  fileChanged(e) {
      this.file = e.target.files[0];
      console.log(this.file.name);

      this.uploadDocument(this.file);
  }


uploadDocument(file) {
    var filedata;
    console.log("here in read");
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // console.log(fileReader.result);

      filedata = fileReader.result;
      console.log(filedata);
      this.collectionService.importCollection(filedata ,file.name, this.collectionnameforreuse).subscribe(res=>{
        console.log("ok");
      });
    }
    fileReader.readAsText(this.file);
}

  ExportCollectionJson() {
    this.collectionService
      .ExportCollectionJson(this.collectionnameforreuse)
      .subscribe(res => {
        console.log("Exported collection");
      });
  }

  getData(collectionName) {
    this.collectionnameforreuse = collectionName;
    this.collectionService.getData(collectionName).subscribe(res => {
      this.collectionService.dataListFlag = 1;
      //before code:
      // this.collectionService.dataList = res;

      var resjson = JSON.stringify(res);

      var resparsed = JSON.parse(resjson);
      console.log("....." + resparsed + "......");

      console.log("length of res is " + resparsed.length);
      if (this.min >= resparsed.length) {
        this.min = 0;
        this.max = 25;
      }

      var sliced = resparsed.slice(this.min, this.max);
      this.collectionService.dataList = sliced;
      console.log("sliced");
      console.log(sliced);

      var count = 1;
      resparsed.forEach(element => {
        if (count == 1) {
          this.dbjson = element;
          count++;
        }
      });

      this.arrres = Object.keys(this.dbjson);
      console.log(Object.keys(this.dbjson));
      console.log("Get data : ");

      console.log(this.dbjson);
    });
  }

  pastcount() {
    if (this.min <= 0) {
      this.min = this.defaultmin;
      this.max = this.defaultmax;
    } else {
      this.min = this.min - 25;
      this.max = this.max - 25;
      this.getData(this.collectionnameforreuse);
    }
  }

  checkIfObjectType(res) {
    if (typeof res == "object") {
      return true;
    }
    return false;
  }

  ExpandObject(res, resField, id) {
    console.log(resField);
    // console.log("id :" + id);
    this.isExpanded = id;
    this.keysOfExpanded = Object.keys(resField);
    this.ValuesOfExpanded = Object.values(resField);
    this.ObjectExpanded = resField;
  }

  onUpdateSubmit(req) {
    console.log("in component file with req  : " + JSON.stringify(req));
    this.collectionService.selectedData = req;
    this.collectionService.selectedflag = 1;

    console.log(this.collectionService.selectedData._id);
    this.collectionService.onUpdateSubmit().subscribe(res => {
      console.log("Res got from update fun");
    });
    this.getData(this.collectionnameforreuse);
  }

  onDelete(req) {
    console.log("IN on Delete method in Component file" + JSON.stringify(req));
    this.collectionService.onDelete(req).subscribe(res => {
      console.log("Delete res got");
    });
  }

  checkfordateformat(str) {
    this.collectionService.resultOfSearchString = 0;

    this.collectionService.fieldNameToSearch = str;
    console.log(this.collectionService.dataList[0]);
    var datatochecktype = this.collectionService.dataList[0][str];
    // var ev = "AdmissionDate";
    console.log(Date.parse(datatochecktype));

    if (Date.parse(datatochecktype)) {
      this.Datatypeofselectedoption = "date";
      console.log(this.Datatypeofselectedoption);
    } else if (Number(datatochecktype)) {
      this.Datatypeofselectedoption = "number";
      console.log(this.Datatypeofselectedoption);
    } else if (typeof datatochecktype === "object") {
      console.log("object type it is");
      this.Datatypeofselectedoption = "object";
    } else {
      this.Datatypeofselectedoption = "string";
      console.log(this.Datatypeofselectedoption);
    }
  }

  searchString(form: NgForm) {
    console.log(form.value.stringToSearch);

    this.collectionService.searchString(form.value).subscribe(res => {
      console.log(res);
      this.collectionService.resultOfSearchString = res;
    });
  }

  searchObject(form: NgForm) {
    console.log(form.value.objecttosearch);
    this.collectionService.searchObject(form.value).subscribe(res => {
      console.log(res);
      this.collectionService.resultOfSearchString = res;
    });
  }

  searchNumber(form: NgForm) {
    console.log(form.value);
    if (form.value.number1 > form.value.number2) {
      var temp: Number;
      temp = form.value.number1;
      form.value.number1 = form.value.number2;
      form.value.number2 = temp;
    }
    console.log(form.value);
    this.collectionService.searchNumber(form.value).subscribe(res => {
      console.log(res);
      this.collectionService.resultOfSearchString = res;
    });
  }

  searchDate(form: NgForm) {
    console.log(form.value);

    if (form.value.date1 > form.value.date2) {
      var temp: Date;
      temp = form.value.date1;
      form.value.date1 = form.value.date2;
      form.value.date2 = temp;
      // console.log(temp.toISOString());
    }
    this.collectionService.searchDate(form.value).subscribe(res => {
      this.collectionService.resultOfSearchString = res;
    });
  }
}
