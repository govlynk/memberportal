/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCompany = /* GraphQL */ `
  subscription OnCreateCompany(
    $filter: ModelSubscriptionCompanyFilterInput
    $owner: String
  ) {
    onCreateCompany(filter: $filter, owner: $owner) {
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
export const onCreateContact = /* GraphQL */ `
  subscription OnCreateContact(
    $filter: ModelSubscriptionContactFilterInput
    $owner: String
  ) {
    onCreateContact(filter: $filter, owner: $owner) {
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
export const onCreateRole = /* GraphQL */ `
  subscription OnCreateRole($filter: ModelSubscriptionRoleFilterInput) {
    onCreateRole(filter: $filter) {
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
export const onCreateTeam = /* GraphQL */ `
  subscription OnCreateTeam(
    $filter: ModelSubscriptionTeamFilterInput
    $owner: String
  ) {
    onCreateTeam(filter: $filter, owner: $owner) {
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
export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onCreateTodo(filter: $filter, owner: $owner) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
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
export const onCreateUserCompanyRole = /* GraphQL */ `
  subscription OnCreateUserCompanyRole(
    $filter: ModelSubscriptionUserCompanyRoleFilterInput
    $owner: String
  ) {
    onCreateUserCompanyRole(filter: $filter, owner: $owner) {
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
export const onDeleteCompany = /* GraphQL */ `
  subscription OnDeleteCompany(
    $filter: ModelSubscriptionCompanyFilterInput
    $owner: String
  ) {
    onDeleteCompany(filter: $filter, owner: $owner) {
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
export const onDeleteContact = /* GraphQL */ `
  subscription OnDeleteContact(
    $filter: ModelSubscriptionContactFilterInput
    $owner: String
  ) {
    onDeleteContact(filter: $filter, owner: $owner) {
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
export const onDeleteRole = /* GraphQL */ `
  subscription OnDeleteRole($filter: ModelSubscriptionRoleFilterInput) {
    onDeleteRole(filter: $filter) {
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
export const onDeleteTeam = /* GraphQL */ `
  subscription OnDeleteTeam(
    $filter: ModelSubscriptionTeamFilterInput
    $owner: String
  ) {
    onDeleteTeam(filter: $filter, owner: $owner) {
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
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onDeleteTodo(filter: $filter, owner: $owner) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
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
export const onDeleteUserCompanyRole = /* GraphQL */ `
  subscription OnDeleteUserCompanyRole(
    $filter: ModelSubscriptionUserCompanyRoleFilterInput
    $owner: String
  ) {
    onDeleteUserCompanyRole(filter: $filter, owner: $owner) {
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
export const onUpdateCompany = /* GraphQL */ `
  subscription OnUpdateCompany(
    $filter: ModelSubscriptionCompanyFilterInput
    $owner: String
  ) {
    onUpdateCompany(filter: $filter, owner: $owner) {
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
export const onUpdateContact = /* GraphQL */ `
  subscription OnUpdateContact(
    $filter: ModelSubscriptionContactFilterInput
    $owner: String
  ) {
    onUpdateContact(filter: $filter, owner: $owner) {
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
export const onUpdateRole = /* GraphQL */ `
  subscription OnUpdateRole($filter: ModelSubscriptionRoleFilterInput) {
    onUpdateRole(filter: $filter) {
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
export const onUpdateTeam = /* GraphQL */ `
  subscription OnUpdateTeam(
    $filter: ModelSubscriptionTeamFilterInput
    $owner: String
  ) {
    onUpdateTeam(filter: $filter, owner: $owner) {
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
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onUpdateTodo(filter: $filter, owner: $owner) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
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
export const onUpdateUserCompanyRole = /* GraphQL */ `
  subscription OnUpdateUserCompanyRole(
    $filter: ModelSubscriptionUserCompanyRoleFilterInput
    $owner: String
  ) {
    onUpdateUserCompanyRole(filter: $filter, owner: $owner) {
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
