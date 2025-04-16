#Constituent Management API

## Description

I used [Nest](https://github.com/nestjs/nest) and [Prisma](https://www.prisma.io) to build this API to interact with constituent data.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start
```

The API will then be available on `localhost:3000` I recommend PostMan to interact with it. 

## Endpoints and Examples

I've setup a few endpoints for the features outlined in the problem statement. 


<code>POST</code> <code><b>/constituents</b></code> <code>(adds or updates an existing constituent record)</code></summary>

Here's an example of the format the expected in the body. If the contact email is already in the database we do not create a new record, but we do update the names and addresses. 

```json
{
  "email": "jane.doe@example.com",
  "names": [
    {
      "title": "Ms.",
      "first": "Jane",
      "middle": "Marie",
      "last": "Doe",
      "suffix": "PhD",
      "isPreferred": true
    },
    {
      "first": "Jane",
      "last": "Smith",
      "isPreferred": false
    }
  ],
  "addresses": [
    {
      "line1": "123 Main Street",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "type": "home",
      "isPreferred": true
    },
    {
      "line1": "456 Business Ave",
      "city": "New York",
      "state": "NY",
      "postalCode": "10002",
      "type": "work",
      "isPreferred": false
    }
  ]
}
```

<code>GET</code> <code><b>/constituents</b></code> <code>(list all of the existing constituents)</code></summary>

<code>GET</code> <code><b>/constituents/{id}</b></code> <code>(show a constituent with a particular id)</code></summary>

<code>GET</code> <code><b>/constituents/export/csv</b></code> <code>(generate a csv of constituent records)</code></summary>

For the export endpoint we also accept a `?startDate=` query string parameter where you can enter a date string to filter the results by. 