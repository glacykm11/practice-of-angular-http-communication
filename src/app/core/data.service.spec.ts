import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { DataService } from "./data.service";
import { Book } from "app/models/book";
import { BookTrackerError } from "app/models/bookTrackerError";

describe('DataService Tests', () => {

    let dataService: DataService;
    let httpTestingController: HttpTestingController;

    let testBooks: Book[] = [
        { bookID: 1, title: 'Goodnight Moon', author: 'Margaret Wise Brown', publicationYear: 1953 },
        { bookID: 2, title: 'Winnie-the-Pooh', author: 'A. A. Milne', publicationYear: 1926 },
        { bookID: 3, title: 'Where the Wild Things Are', author: 'Maurice Sendak', publicationYear: 1963 },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [ DataService ]
        })

        dataService = TestBed.inject(DataService);
        httpTestingController = TestBed.inject(HttpTestingController)
    });

    afterEach(() => {
        httpTestingController.verify(); // Verifica se estão sendo feitas as chamadas HTTP
    })

    it('should GET all books', () => {
        dataService.getAllBooks()
         .subscribe((data: Book[]) => {
                 expect(data.length).toBe(3);
             });

        let booksRequest: TestRequest = httpTestingController.expectOne('api/books');
        expect(booksRequest.request.method).toEqual('GET');

        booksRequest.flush(testBooks); // Adiciona os livros ao body da response
    });

    it('should return a BookTrackerError', () => {
        dataService.getAllBooks()
         .subscribe(
             (data:Book[]) => fail('This should have been an error'),
             (err: BookTrackerError) => {
                 expect(err.errorNumber).toEqual(100);
                 expect(err.friendlyMessage).toEqual('An error occurred retrieving data.')
             }
        )

        let booksRequest: TestRequest = httpTestingController.expectOne('api/books');

        booksRequest.flush('error', {
            status: 500,
            statusText: 'Server Error'
        })
    });
})
