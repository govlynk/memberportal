/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCompany = /* GraphQL */ `
  mutation CreateCompany(
    $condition: ModelCompanyConditionInput
    $input: CreateCompanyInput!
  ) {
    createCompany(condition: $condition, input: $input) {
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
export const createContact = /* GraphQL */ `
  mutation CreateContact(
    $condition: ModelContactConditionInput
    $input: CreateContactInput!
  ) {
    createContact(condition: $condition, input: $input) {
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
export const createRole = /* GraphQL */ `
  mutation CreateRole(
    $condition: ModelRoleConditionInput
    $input: CreateRoleInput!
  ) {
    createRole(condition: $condition, input: $input) {
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
export const createTeam = /* GraphQL */ `
  mutation CreateTeam(
    $condition: ModelTeamConditionInput
    $input: CreateTeamInput!
  ) {
    createTeam(condition: $condition, input: $input) {
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
export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $condition: ModelTodoConditionInput
    $input: CreateTodoInput!
  ) {
    createTodo(condition: $condition, input: $input) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $condition: ModelUserConditionInput
    $input: CreateUserInput!
  ) {
    createUser(condition: $condition, input: $input) {
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
export const createUserCompanyRole = /* GraphQL */ `
  mutation CreateUserCompanyRole(
    $condition: ModelUserCompanyRoleConditionInput
    $input: CreateUserCompanyRoleInput!
  ) {
    createUserCompanyRole(condition: $condition, input: $input) {
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
export const deleteCompany = /* GraphQL */ `
  mutation DeleteCompany(
    $condition: ModelCompanyConditionInput
    $input: DeleteCompanyInput!
  ) {
    deleteCompany(condition: $condition, input: $input) {
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
export const deleteContact = /* GraphQL */ `
  mutation DeleteContact(
    $condition: ModelContactConditionInput
    $input: DeleteContactInput!
  ) {
    deleteContact(condition: $condition, input: $input) {
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
export const deleteRole = /* GraphQL */ `
  mutation DeleteRole(
    $condition: ModelRoleConditionInput
    $input: DeleteRoleInput!
  ) {
    deleteRole(condition: $condition, input: $input) {
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
export const deleteTeam = /* GraphQL */ `
  mutation DeleteTeam(
    $condition: ModelTeamConditionInput
    $input: DeleteTeamInput!
  ) {
    deleteTeam(condition: $condition, input: $input) {
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
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $condition: ModelTodoConditionInput
    $input: DeleteTodoInput!
  ) {
    deleteTodo(condition: $condition, input: $input) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $condition: ModelUserConditionInput
    $input: DeleteUserInput!
  ) {
    deleteUser(condition: $condition, input: $input) {
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
export const deleteUserCompanyRole = /* GraphQL */ `
  mutation DeleteUserCompanyRole(
    $condition: ModelUserCompanyRoleConditionInput
    $input: DeleteUserCompanyRoleInput!
  ) {
    deleteUserCompanyRole(condition: $condition, input: $input) {
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
export const updateCompany = /* GraphQL */ `
  mutation UpdateCompany(
    $condition: ModelCompanyConditionInput
    $input: UpdateCompanyInput!
  ) {
    updateCompany(condition: $condition, input: $input) {
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
export const updateContact = /* GraphQL */ `
  mutation UpdateContact(
    $condition: ModelContactConditionInput
    $input: UpdateContactInput!
  ) {
    updateContact(condition: $condition, input: $input) {
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
export const updateRole = /* GraphQL */ `
  mutation UpdateRole(
    $condition: ModelRoleConditionInput
    $input: UpdateRoleInput!
  ) {
    updateRole(condition: $condition, input: $input) {
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
export const updateTeam = /* GraphQL */ `
  mutation UpdateTeam(
    $condition: ModelTeamConditionInput
    $input: UpdateTeamInput!
  ) {
    updateTeam(condition: $condition, input: $input) {
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
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $condition: ModelTodoConditionInput
    $input: UpdateTodoInput!
  ) {
    updateTodo(condition: $condition, input: $input) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $condition: ModelUserConditionInput
    $input: UpdateUserInput!
  ) {
    updateUser(condition: $condition, input: $input) {
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
export const updateUserCompanyRole = /* GraphQL */ `
  mutation UpdateUserCompanyRole(
    $condition: ModelUserCompanyRoleConditionInput
    $input: UpdateUserCompanyRoleInput!
  ) {
    updateUserCompanyRole(condition: $condition, input: $input) {
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
