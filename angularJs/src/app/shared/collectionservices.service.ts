import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
@Injectable({
  providedIn: 'root'
})
export class CollectionservicesService {

  baseUrl = "http://localhost:3000/";
  constructor(public http : HttpClient) { }

  dataBaseNames;

  selectedData;
  selectedflag = 0;


  collectionNames;
  collectionFlag = 0;

  dataList;
  dataListFlag = 0;

  fieldNameToSearch = '';

  stringtosearch="";
  resultOfSearchString;

  numbertosearch1:Number;
  numbertosearch2:Number;

  dateToSearch1:Date ;
  dateToSearch2:Date ;

  objecttosearch="";







  getdbList(){
    return this.http.get(this.baseUrl);
  }

  getCollectionData(dbName){
    console.log("here in service");
    return this.http.post(this.baseUrl , dbName);
  }



  DeleteCollection(collectionName){
    var urldeleteCollection = this.baseUrl+"deleteCollection";
    return this.http.post(urldeleteCollection , collectionName);
  }


  ExportCollection(collectionName){
    return this.http.post(this.baseUrl+"ExportCollection" , collectionName);
  }

  ExportCollectionJson(collectionName){
    return this.http.post(this.baseUrl+"ExportCollectionJson" , collectionName);
  }

  DeleteDb(dbName){
    return this.http.post(this.baseUrl+'DeleteDb',dbName);
  }

  BackupDatabase(dbName){
    return this.http.post(this.baseUrl+'BackupDatabase',dbName);
  }


  importCollection(filedata,fileName , collectionName){
    console.log("In service ");
    console.log(typeof(filedata));
    console.log(fileName);


    var datatosend = {
      "fileName" :fileName,
      "filedata" : filedata,
      "collectionName":collectionName
    }
    return this.http.post(this.baseUrl + "ImportFile" , datatosend);
  }


  getData(collectionName){
    // console.log("......."+collectionName+".........");
    var urldata =this.baseUrl+"getdata";
    console.log("In process fetching data : " + urldata);
    return this.http.post(urldata , collectionName);
  }



  updateData(req){
    var urlToUpdate = this.baseUrl +"updatedata";
    console.log("in service file with req :" + req);
    // return this.http.post(urlToUpdate , req);
  }


  onDelete(req){
    var urlToDelete = this.baseUrl +"deletedata";
    return this.http.post(urlToDelete , req);
  }


  onUpdateSubmit(){
    console.log("in service on updatecall : "+ JSON.stringify(this.selectedData));
    return this.http.put(this.baseUrl+this.selectedData._id , this.selectedData);
  }


  searchString(form){
    var datatosend ={
      "stringToSearch": form.stringToSearch ,
      "fieldName" : this.fieldNameToSearch
    }

    var url =this.baseUrl+'searchString';
    console.log(form.stringToSearch );
    return this.http.post(url, datatosend);
  }


  searchNumber(form){
    var datatosend ={
      "number1": form.number1 ,
      "number2": form.number2,
      "fieldName" : this.fieldNameToSearch
    }

    console.log(datatosend);

    var url = this.baseUrl+'searchNumber';
    return this.http.post(url , datatosend);
  }


  searchDate(form){
    console.log("In Service DateSearch");
    console.log(form.date1);

    var date1:Date = form.date1;
    var date2:Date = form.date2;

    var datatosend = {
      "date1" : date1,
      "date2" : date2,
      "fieldName" : this.fieldNameToSearch
    }

    var url = this.baseUrl+'searchDate';
    return this.http.post(url , datatosend);
  }


  searchObject(form){
    console.log(form.objecttosearch);

    var objecttosearch = form.objecttosearch;

    var datatosend = {
      "objecttosearch" : objecttosearch,
      "fieldName":this.fieldNameToSearch
    }
    var url = this.baseUrl+'searchObject';
    return this.http.post(url , datatosend);
  }
}
