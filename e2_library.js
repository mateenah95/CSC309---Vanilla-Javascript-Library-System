/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();
	
	// Add book book to global array
	const name = bookAddForm.children[0].value.trim();
	const author = bookAddForm.children[1].value.trim();
	const genre = bookAddForm.children[2].value.trim();

	const new_book = new Book(name, author, genre);

	libraryBooks.push(new_book);
	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(new_book);

	bookAddForm.children[0].value = '';
	bookAddForm.children[1].value = '';
	bookAddForm.children[2].value = '';
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	const book = libraryBooks[bookLoanForm.children[0].value];
	const patron = patrons[bookLoanForm.children[1].value];

	// Add patron to the book's patron property
	book.patron = patron;

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(book);
	
	// Start the book loan timer.
	book.setLoanTime();

	bookLoanForm.children[0].value = '';
	bookLoanForm.children[1].value = '';
}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();

	// check if return button was clicked, otherwise do nothing.
	if(e.target.nodeName == 'BUTTON'){
		const book_number = e.target.parentNode.parentNode.children[0].innerText;
		const book = libraryBooks[parseInt(book_number)];
		
		// Call removeBookFromPatronTable()
		removeBookFromPatronTable(book);

		// Change the book object to have a patron of 'null'
		book.patron = null;
	}

}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	const patron_name = patronAddForm.children[0].value.trim()
	const new_patron = new Patron(patron_name);
	patrons.push(new_patron);

	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(new_patron);
	patronAddForm.children[0].value = '';	
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
	const book = libraryBooks[bookInfoForm.children[0].value];
	// Call displayBookInfo()	
	displayBookInfo(book);
	
	bookInfoForm.children[0].value = "";
}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	const book_name = document.createElement('td');
	book_name.innerHTML = '<strong>'+book.title+'</strong>';
	const book_id = document.createElement('td');
	book_id.innerText = book.bookId;
	const lender_id = document.createElement('td');
	lender_id.innerText = book.patron ? book.patron.cardNumber : '';

	const new_row = document.createElement('tr');

	new_row.appendChild(book_id);
	new_row.appendChild(book_name);
	new_row.appendChild(lender_id);

	bookTable.children[0].appendChild(new_row);
}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here
	bookInfo.children[0].innerHTML = "Book Id: <span>"+book.bookId+"</span>";
	bookInfo.children[1].innerHTML = "Title: <span>"+book.title+"</span>";
	bookInfo.children[2].innerHTML = "Author: <span>"+book.author+"</span>";
	bookInfo.children[3].innerHTML = "Genre: <span>"+book.genre+"</span>";
	bookInfo.children[4].innerHTML = "Currently loaned out to: <span>"+ (book.patron ? book.patron.name : "N/A") +"</span>";


}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here
	const patron = book.patron;

	const book_id = document.createElement('td');
	book_id.innerText = book.bookId;

	const book_title = document.createElement('td');
	book_title.innerHTML = '<strong>'+book.title+'</strong>';

	const book_status = document.createElement('td');
	const green_span = document.createElement('span');
	green_span.className = 'green';
	green_span.innerText = 'Within due date';
	book_status.appendChild(green_span);

	const return_button = document.createElement('button');
	return_button.innerText = 'return';
	const return_status = document.createElement('td');
	return_status.appendChild(return_button);

	const table_row = document.createElement('tr');
	table_row.appendChild(book_id);
	table_row.appendChild(book_title);
	table_row.appendChild(book_status);
	table_row.appendChild(return_status);

	patronEntries.children[patron.cardNumber].children[3].children[0].appendChild(table_row);	
	bookTable.children[0].children[book.bookId+1].children[2].innerText = patron.cardNumber;
}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here
	const patron_cell = document.createElement('div');
	patron_cell.className = 'patron';

	const name_line = document.createElement('p');
	name_line.innerHTML = 'Name: <span>' + patron.name + '</span>';

	const card_num_line = document.createElement('p');
	card_num_line.innerHTML = 'Card Number: <span>' + patron.cardNumber + '</span>';

	const books_on_loan = document.createElement('h4');
	books_on_loan.innerHTML = 'Books on loan:'

	const patrons_loan_table = document.createElement('table');
	patrons_loan_table.className = 'patronsLoanTable';

	const table_body = document.createElement('tbody');

	const table_row = document.createElement('tr');

	const book_id = document.createElement('th');
	book_id.innerText = 'BookID';

	const book_title = document.createElement('th');
	book_title.innerText = 'Title';

	const book_status = document.createElement('th');
	book_status.innerText = 'Status';

	const book_return = document.createElement('th');
	book_return.innerText = 'Return';

	table_row.appendChild(book_id);
	table_row.appendChild(book_title);
	table_row.appendChild(book_status);
	table_row.appendChild(book_return);

	table_body.appendChild(table_row);

	patrons_loan_table.appendChild(table_body);

	patron_cell.appendChild(name_line);
	patron_cell.appendChild(card_num_line);
	patron_cell.appendChild(books_on_loan);
	patron_cell.appendChild(patrons_loan_table);
	
	patronEntries.appendChild(patron_cell);
}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	const bookTableRows = bookTable.children[0].children;

	for(let i = 1; i < bookTableRows.length; i++){
		if(bookTableRows[i].children[0].innerText == book.bookId){
			bookTableRows[i].children[2].innerText = '';
		}
	}

	helper(book, 'removeBookFromPatronTable');
}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	helper(book, 'changeToOverdue');
}

//helper function
function helper(book, flag){
	const patron_number = book.patron.cardNumber;
	const patronCell = patronEntries.children[patron_number];
	const patronLoanTable = patronCell.children[3].children[0];
	const patronLoanTableRows = patronLoanTable.children;

	for(let i = 1; i < patronLoanTableRows.length; i++){
		if(patronLoanTableRows[i].children[0].innerText == book.bookId){
			if(flag == 'changeToOverdue'){
				patronLoanTableRows[i].children[2].innerHTML = "<span class='red'>Overdue</span>";
			}
			if(flag == 'removeBookFromPatronTable'){
				patronLoanTableRows[i].parentNode.removeChild(patronLoanTableRows[i]);
			}
		}
	}
}
