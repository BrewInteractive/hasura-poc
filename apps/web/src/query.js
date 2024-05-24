import { gql } from "@apollo/client";

export const LOGIN = gql`
  query Login($password: String!, $username: String!) {
    login(
      object: {
        password: $password
        username: $username
        keepMeLoggedIn: false
      }
    ) {
      loggedInUser {
        authToken
        userId
        fullName
      }
      error {
        code
      }
    }
  }
`;

export const GET_ROOMS = gql`
  query GetRooms {
    room {
      id
      name
      created_user_id
      user {
        name
        surname
      }
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation CreateRoom($name: String!) {
    insert_room(objects: { name: $name }) {
      returning {
        id
      }
    }
  }
`;

export const SUBSCRIBE_MESSAGES = gql`
  subscription OnMessageAdded($room_id: Int!) {
    chat(
      where: { room_id: { _eq: $room_id } }
      limit: 10
      order_by: { id: desc }
    ) {
      id
      user_id
      message
      user {
        name
        surname
      }
    }
  }
`;

export const INSERT_MESSAGE = gql`
  mutation InsertMessage($message: String!, $room_id: Int!) {
    insert_chat(objects: { message: $message, room_id: $room_id }) {
      returning {
        id
      }
    }
  }
`;

export const INSERT_USER = gql`
  mutation InsertUser($name: String!, $surname: String!, $id: String!) {
    insert_user(objects: { name: $name, surname: $surname, id: $id }) {
      returning {
        id
      }
    }
  }
`;

export const SCHEDULE = gql`
  query Schedule {
    schedule(object: { pageNo: 0, pageSize: 10 }) {
      meetings {
        meetingRoom {
          roomName
          description
        }
        meetingName
        startTime
        endTime
        meetingState
        meetingUsers
        organizerRoId
        meetingId
        isPrivate
        isMyRoom
      }
      error {
        code
        desc
        exception
      }
      totalCount
    }
  }
`;

export const PROFILE = gql`
  query GetProfile {
    profile {
      profile {
        accountId
        company
        firstName
        language
        lastName
        mail
        name
        phone
        position
      }
      error {
        code
        desc
        exception
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: String!) {
    user(where: { id: { _eq: $userId } }) {
      id
    }
  }
`;
