const { ApolloServer, gql } = require("apollo-server");
const axios = require('axios');


const typeDefs = gql`
  type Book {
    id: String  
    title: String
    author: String
  }

  type Quote {
    id: String
    quote: String
    author: String
  }

  type Query {
    Getbooks: [Book],
    Getbook(id:String!):Book
    Getquotes: [Quote]
    Getquote: Quote
  }
  type Mutation {
      CreateBook(id: String!,title: String!, author: String!): Book
      DeleteBook(id: String!): Book
      UpdateBook(id: String!,title: String!, author: String!): Book
      CreateQuote(id:String!, quote: String!, author: String!): Quote
      DeleteQuote(id: String!): Quote
      UpdateQuote(id: String!, quote: String!, author: String!): Quote
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

  let quotes = []
  
  const getBreakingBadQuotes = async()=>{
    const response = await axios.get('https://api.breakingbadquotes.xyz/v1/quotes/10')
    let index = 0;
    response.data.forEach(element => {
      element['id'] = index.toString()
      index++
      quotes.push(element)
    });
  }

  getBreakingBadQuotes()

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
             
                              },
        CreateQuote:(_,arg) => {quotes.push(arg); return arg},
        DeleteQuote:(_,arg)=>{
                              let finalquotes=quotes.filter(quote => quote.id != arg.id);
                              let quoteDelete = quotes.find(quote => quote.id == arg.id );   
                              quotes = [...finalquotes]; 
                              return quoteDelete
        },
        UpdateQuote:(_,arg)=>{
                              let objIdx = quotes.findIndex(quote => quote.id == arg.id);
                              quotes[objIdx] = arg
                              return arg   
        },
    },  
    Query: {
      Getbooks: () => books,
      Getbook: (_,arg) => books.find(number => number.id==arg.id),
      Getquotes: () => quotes,
      Getquote: (_,arg) => quotes.find(number => number.id==arg.id),
    },
  };



const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});