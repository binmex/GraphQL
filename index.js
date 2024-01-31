const express = require("express");

const express_graphql = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");

const app = express();

const { books } = require("./data.json");

const schema = buildSchema(`
type Query{
    book(id:Int!):Book 
    books(genre :String):[Book] 
},
type Mutation{
    updateBookGenre(id:Int!,genre:String!):Book
},
type Book{
    id: Int
    title : String
    author : String
    pages : Int
    year : Int
    genre:String
    }
`);

let updateBookGenre = ({id,genre})=>{
    books.map((book)=>{
        if (book.id == id){
            book.genre = genre
            return book
        }
    })

    return books.find(book => book.id==id)
}

let getBook = (args) => {
  let id = args.id;
  return books.filter((book) => book.id == id)[0];
};

let getBooks = (args) => {
  if (args.genre) {
    let genre = args.genre;
    return books.filter((book) => book.genre == genre);
  } else {
    return books;
  }
};
const root = {
  book : getBook,
  books : getBooks,
  updateBookGenre: updateBookGenre 
};

app.set("port", process.env.PORT || 3000);
app.use(
  "/graphql",
  express_graphql({ schema: schema, rootValue: root, graphiql: true })
);
app.listen(app.get("port"), () =>
  console.log(`Server at Port ${app.get("port")}`)
);
