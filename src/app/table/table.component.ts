import { Component, ElementRef, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PeriodicElement {
  id: number,
  isActive: boolean,
  balance: string,
  picture: string,
  age: number,
  eyeColor: string,
  name: string,
  gender: string,
  company: string,
  email: string,
  phone: string
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  data: Array<PeriodicElement> = []
  displayedColumns: string[] = ['id', 'name', 'gender', 'age', 'balance', 'company', 'email', 'phone',];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  loading: Boolean = false

  constructor(private http: HttpClient) {
    this.loading = true
    this.getJSON().subscribe(data => {
      this.dataSource.data = data;
      this.loading = false
    });
  }

  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef | any;
  @ViewChild('exporter', { static: false }) exporter: ElementRef | any;

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.exporter.exportCompleted.subscribe((res: any) => {
      console.log(res)
      this.loading = false;
      this.paginator.disabled = false
    });
  }

  applyFilter(filterValue: any) {
    filterValue = filterValue.value.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ScoreSheet.xlsx');
  }


  public getJSON(): Observable<any> {
    return this.http.get("./assets/mockdata.json");
  }

  public getExcel(data: string) {
    this.paginator.disabled = true
    this.loading = true;
    this.exporter.exportTable(data)
  }

}