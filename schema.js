const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

/*
//hard coded data

const customers = [
    {id:'1', name:'John Doe', email:'John@email.com', age: 25},
    {id:'2', name:'Jane Doe', email:'Jane@email.com', age: 55},
    {id:'3', name:'Bill Smite', email:'Billy@email.com', age: 25},
    {id:'4', name:'John Adams', email:'JohnnyBoy@email.com', age: 35},
    {id:'5', name:'Kill Bill', email:'Kill@email.com', age: 45},
]

*/


//Customer Type

const CustomerType = new GraphQLObjectType({
    name:'Customer',
    fields:()=>({
        id:{type:GraphQLString},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        age:{type:GraphQLInt}
    })
})


// Root Query
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields: {
        customer:{
            type:CustomerType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue, args){
                /*
                for(let i=0;i<customers.length;i++){
                    if(customers[i].id == args.id){
                        return customers[i];
                    }
                }
                */
                return axios.get('http://localhost:3000/customers/' + args.id).then(response=>{
                    return res.data
                });

            }
        },
        customers:{
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args){
                /*
                return customers;
                */
                return axios.get('http://localhost:3000/customers').then(response=>{
                    return res.data
                });
            }
        }
    }
    
});


//Mutations
const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addCustomer:{
            type: CustomerType,
            args:{
                name:{type: new GraphQLNonNull(GraphQLString)},
                email:{type: new GraphQLNonNull(GraphQLString)},
                age:{type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/customers', {
                    name: args.name,
                    email: args.email,
                    age: args.age
                }).then(res=>res.data);
            }
        },
        deleteCustomer:{
            type: CustomerType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}                
            },
            resolve(parentValue, args){
                return axios.delete(`http://localhost:3000/customers/${args.id}`).then(res=>res.data);
            }
        },
        editCustomer:{
            type: CustomerType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
                name:{type: GraphQLString},
                email:{type: GraphQLString},
                age:{type: GraphQLInt}               
            },
            resolve(parentValue, args){
                return axios.patch(`http://localhost:3000/customers/${args.id}`,args).then(res=>res.data);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});