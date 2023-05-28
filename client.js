const path = require('path');
const myEpress = require('./server');
const app = myEpress();
const PORT =3000;

// Middleware function
  const logger = (req, res, next) => {
    console.log('Logging middleware');
    next(); // Calls the next middleware function
  };

  // Middleware function to handle requests
app.use(logger);

                                                                    //SEND FIlE

app.get('/books/resume', (req, res) => {
    const filePath = path.join(__dirname,'./resume.pdf'); // Replace with the actual file path
    // Send the file as a response
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(err.status).end();
      } else {
        console.log('File sent successfully');
      }
    });
  });

                                                    //(GET) ROUTING AND READING PARAMS

app.get('/books/:id',(req,res)=>{
    //Getting PARAMS has been implemented
    
    console.log("Here is the params",req.params);
    //books data
    const booksData = {
        books: [
          {
            id: 1,
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            publication_year: 1960,
            isbn: '9780061120084'
          }
        ]
      };
    //res.json has been implemented
    res.json(booksData)
    })
    
                                                            //DELETE METHOD
  app.delete('/books/:id',(req,res)=>{
    const id =req.params.id;

    //res.status().json() has been implemented
    res.status(404).json(`Book with ${id} deleted`);

    //req.headers has been implemented
    console.log(req.headers);
  })


                                                    //GET METHOD 
app.get('/books', (req, res) => {
    //Getting QUERY has been implemented
    console.log('Here is the all queries', req.query)
    
    //Method res.send has been implemented
    res.send('books');
  });

                                                            // POST METHOD
app.post('/books', (req,res) => {
    console.info('Here is the body of request in POST method', req.body)
    res.json(req.body);
  })

                                                            // PUT METHOD
app.put('/books', (req,res) => {
    console.info('Here is the body of request in PUT method', req.body)
    res.json(req.body);
  })



                                                    //APP LISTEN METHOD HAS BEEN IMPLEMENTED
  app.listen(PORT, () => {
    console.log('Server running on 3000');
  })
