using { my.employee } from '../db/data-model';

service CatalogService {
 entity empheader as projection on employee.empheader;
}