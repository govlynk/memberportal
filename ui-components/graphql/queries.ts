/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCompany = /* GraphQL */ `
  query GetCompany($id: ID!) {
    getCompany(id: $id) {
      cageCode
      companyEmail
      companyPhoneNumber
      companyWebsite
      createdAt
      dbaName
      ein
      id
      legalBusinessName
      owner
      status
      teams {
        nextToken
        __typename
      }
      uei
      updatedAt
      users {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const getContact = /* GraphQL */ `
  query GetContact($id: ID!) {
    getContact(id: $id) {
      contactBusinessPhone
      contactEmail
      contactMobilePhone
      createdAt
      dateLastContacted
      department
      firstName
      id
      lastName
      notes
      owner
      teams {
        nextToken
        __typename
      }
      title
      updatedAt
      workAddressCity
      workAddressCountryCode
      workAddressStateCode
      workAddressStreetLine1
      workAddressStreetLine2
      workAddressZipCode
      __typename
    }
  }
`;
export const getRole = /* GraphQL */ `
  query GetRole($id: ID!) {
    getRole(id: $id) {
      createdAt
      description
      id
      name
      permissions
      updatedAt
      userCompanyRoles {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const getTeam = /* GraphQL */ `
  query GetTeam($id: ID!) {
    getTeam(id: $id) {
      company {
        cageCode
        companyEmail
        companyPhoneNumber
        companyWebsite
        createdAt
        dbaName
        ein
        id
        legalBusinessName
        owner
        status
        uei
        updatedAt
        __typename
      }
      companyId
      contact {
        contactBusinessPhone
        contactEmail
        contactMobilePhone
        createdAt
        dateLastContacted
        department
        firstName
        id
        lastName
        notes
        owner
        title
        updatedAt
        workAddressCity
        workAddressCountryCode
        workAddressStateCode
        workAddressStreetLine1
        workAddressStreetLine2
        workAddressZipCode
        __typename
      }
      contactId
      createdAt
      id
      owner
      role
      updatedAt
      __typename
    }
  }
`;
export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      actualEffort
      assignee {
        cognitoId
        createdAt
        email
        id
        lastLogin
        name
        owner
        phone
        status
        updatedAt
        __typename
      }
      assigneeId
      createdAt
      description
      dueDate
      estimatedEffort
      id
      owner
      position
      priority
      status
      tags
      title
      updatedAt
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      cognitoId
      companies {
        nextToken
        __typename
      }
      createdAt
      email
      id
      lastLogin
      name
      owner
      phone
      status
      todos {
        nextToken
        __typename
      }
      updatedAt
      __typename
    }
  }
`;
export const getUserCompanyRole = /* GraphQL */ `
  query GetUserCompanyRole($id: ID!) {
    getUserCompanyRole(id: $id) {
      company {
        cageCode
        companyEmail
        companyPhoneNumber
        companyWebsite
        createdAt
        dbaName
        ein
        id
        legalBusinessName
        owner
        status
        uei
        updatedAt
        __typename
      }
      companyId
      createdAt
      id
      owner
      role {
        createdAt
        description
        id
        name
        permissions
        updatedAt
        __typename
      }
      roleId
      status
      updatedAt
      user {
        cognitoId
        createdAt
        email
        id
        lastLogin
        name
        owner
        phone
        status
        updatedAt
        __typename
      }
      userId
      __typename
    }
  }
`;
export const listCompanies = /* GraphQL */ `
  query ListCompanies(
    $filter: ModelCompanyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCompanies(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        cageCode
        companyEmail
        companyPhoneNumber
        companyWebsite
        createdAt
        dbaName
        ein
        id
        legalBusinessName
        owner
        status
        uei
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listContacts = /* GraphQL */ `
  query ListContacts(
    $filter: ModelContactFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listContacts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        contactBusinessPhone
        contactEmail
        contactMobilePhone
        createdAt
        dateLastContacted
        department
        firstName
        id
        lastName
        notes
        owner
        title
        updatedAt
        workAddressCity
        workAddressCountryCode
        workAddressStateCode
        workAddressStreetLine1
        workAddressStreetLine2
        workAddressZipCode
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listRoles = /* GraphQL */ `
  query ListRoles(
    $filter: ModelRoleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRoles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        createdAt
        description
        id
        name
        permissions
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listTeams = /* GraphQL */ `
  query ListTeams(
    $filter: ModelTeamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeams(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        companyId
        contactId
        createdAt
        id
        owner
        role
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        actualEffort
        assigneeId
        createdAt
        description
        dueDate
        estimatedEffort
        id
        owner
        position
        priority
        status
        tags
        title
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listUserCompanyRoles = /* GraphQL */ `
  query ListUserCompanyRoles(
    $filter: ModelUserCompanyRoleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserCompanyRoles(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        companyId
        createdAt
        id
        owner
        roleId
        status
        updatedAt
        userId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        cognitoId
        createdAt
        email
        id
        lastLogin
        name
        owner
        phone
        status
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
