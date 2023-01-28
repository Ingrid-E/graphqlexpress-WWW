const { ApolloServer, gql } = require("apollo-server");


const typeDefs = gql`
  type Book {
    id: String  
    title: String
    author: String
  }

  type Query {
    Getbooks: [Book],
    Getbook(id:String!):[Book]
  }
  type Mutation {
      CreateBook(id: String!,title: String!, author: String!): Book
      DeleteBook(id: String!): Book
      UpdateBook(id: String!,title: String!, author: String!): Book 
  }
`;

let books = [
    {
      id:"1",
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      id:"2",  
      title: 'City of Glass',
      author: 'Paul Auster',
    },
    {
       id:"3",  
       title: 'Del amor y otros demonios',
       author: 'Gabriel garcia Marquez',
    }
  ];
  const resolvers = {
    Mutation: {
        CreateBook: (_,arg) => {books.push(arg); return arg},
        DeleteBook: (_,arg) => { 
                                 let finalbooks=books.filter(book => book.id != arg.id);
                                 let bookdeleted = books.find(book => book.id == arg.id );   
                                 books = [...finalbooks]; 
                                 return bookdeleted
                                },
        UpdateBook:(_,arg) => {  let objIdx = books.findIndex(book => book.id == arg.id);
                                 books[objIdx] = arg
                                 return arg   
             
                              }                        

    },  
    Query: {
      Getbooks: () => books,
      Getbook: (_,arg) => books.find(number => number.id==arg.id)
    },
  };


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});